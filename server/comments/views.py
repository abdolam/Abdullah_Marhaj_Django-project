from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Comment
from .serializers import CommentSerializer
from articles.models import Article
from django.shortcuts import get_object_or_404
from .permissions import IsOwnerOrAdmin


class ArticleCommentsListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs["id"]
        return Comment.objects.filter(article_id=article_id).order_by("-created_at")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def perform_create(self, serializer):
        article_id = self.kwargs["id"]
        article = get_object_or_404(Article, id=article_id)
        serializer.save(user=self.request.user, article=article)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
