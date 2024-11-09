from requests_html import HTMLSession

session = HTMLSession()
url = "https://www.youtube.com/watch?v=2l-R4GzbjoI"
r = session.get(url)
r.html.render(sleep=1, keep_page=True, scrolldown=1)
videos = r.html.find("#video-title")
for item in videos:
    video = {"title": item.text, "link": item.absolute_links}
print(videos)
