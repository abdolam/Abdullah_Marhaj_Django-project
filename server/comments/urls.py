from django.urls import path
from .views import ArticleCommentsListCreateView, CommentDetailView

urlpatterns = [
    path("articles/<int:id>/comments/", ArticleCommentsListCreateView.as_view(), name="article_comments"),
    path("comments/<int:pk>/", CommentDetailView.as_view(), name="comment_detail"),
]