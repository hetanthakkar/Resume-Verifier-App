# Backend Fix Guide for Comments API

## Issue
The backend is rejecting comments with `null` values for the `rect` field, but the frontend needs to send empty objects `{}` when there's no annotation coordinates.

## Problem
```
Validation errors: {'rect': [ErrorDetail(string='This field may not be null.', code='null')]}
```

## Solution

### Option 1: Update Backend Validation (Recommended)

In your Django serializer or model, update the `rect` field to allow empty objects:

**Django Serializer:**
```python
class CommentSerializer(serializers.ModelSerializer):
    rect = serializers.JSONField(default=dict, required=False)
    
    class Meta:
        model = Comment
        fields = ['id', 'text', 'page_number', 'rect', 'resume_id', 'job_id', 'created_at', 'created_by']
```

**Django Model:**
```python
class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField()
    page_number = models.IntegerField()
    rect = models.JSONField(default=dict, blank=True)  # Allow empty dict
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Option 2: Update Database Schema

If you need to update the existing database:

```sql
-- Update existing null values to empty objects
UPDATE comments SET rect = '{}' WHERE rect IS NULL;

-- Alter the column to have a default value
ALTER TABLE comments ALTER COLUMN rect SET DEFAULT '{}';
ALTER TABLE comments ALTER COLUMN rect SET NOT NULL;
```

### Option 3: Handle in View (Quick Fix)

In your Django view, handle the null case:

```python
def create_comment(request):
    data = request.data.copy()
    
    # Convert null rect to empty object
    if data.get('rect') is None:
        data['rect'] = {}
    
    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
```

## Testing

After implementing the fix, test with these scenarios:

1. **Comment with annotation coordinates:**
```json
{
  "text": "Great experience",
  "page_number": 1,
  "rect": {"x1": 100, "y1": 200, "x2": 300, "y2": 220},
  "resume_id": 3,
  "job_id": 1
}
```

2. **Comment without annotation coordinates:**
```json
{
  "text": "General comment",
  "page_number": 1,
  "rect": {},
  "resume_id": 3,
  "job_id": 1
}
```

## Expected Behavior

- Both request types should be accepted
- Comments with coordinates should store the exact coordinates
- Comments without coordinates should store an empty object `{}`
- The frontend can distinguish between the two cases when displaying

## Migration (if needed)

If you have existing data with null values:

```python
# Django migration
from django.db import migrations

def convert_null_rect_to_empty(apps, schema_editor):
    Comment = apps.get_model('your_app', 'Comment')
    Comment.objects.filter(rect__isnull=True).update(rect={})

class Migration(migrations.Migration):
    dependencies = [
        ('your_app', 'previous_migration'),
    ]

    operations = [
        migrations.RunPython(convert_null_rect_to_empty),
    ]
``` 