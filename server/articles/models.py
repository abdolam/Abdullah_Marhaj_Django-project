from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)
    author_name = models.CharField(max_length=150)
    tags = models.ManyToManyField(Tag, blank=True, related_name="articles")

    def __str__(self) -> str:
        return self.title
