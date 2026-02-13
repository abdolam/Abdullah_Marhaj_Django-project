from rest_framework import serializers
from .models import Article, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class ArticleSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_names = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "content",
            "published_at",
            "author_name",
            "tags",
            "tag_names",
        ]
        read_only_fields = ["id", "published_at", "tags", "author_name"]

    def create(self, validated_data):
        tag_names = validated_data.pop("tag_names", [])
        article = Article.objects.create(**validated_data)

        if tag_names:
            tags = []
            for name in tag_names:
                name = str(name).strip()
                if not name:
                    continue
                tag, _ = Tag.objects.get_or_create(name=name)
                tags.append(tag)
            article.tags.set(tags)

        return article

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tag_names", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tag_names is not None:
            tags = []
            for name in tag_names:
                name = str(name).strip()
                if not name:
                    continue
                tag, _ = Tag.objects.get_or_create(name=name)
                tags.append(tag)
            instance.tags.set(tags)

        return instance
