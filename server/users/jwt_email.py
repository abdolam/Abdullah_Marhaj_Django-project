from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    # שדה אימייל לקבלה מהלקוח
    email = serializers.EmailField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # SimpleJWT מוסיף username כברירת מחדל, אנחנו לא רוצים אותו בטופס/ולידציה
        self.fields.pop("username", None)

    def validate(self, attrs):
        email = str(attrs.get("email", "")).strip().lower()
        password = str(attrs.get("password", ""))

        if not email or not password:
            raise serializers.ValidationError({"detail": "email and password are required"})

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            raise serializers.ValidationError({"detail": "No active account found with the given credentials"})

        return super().validate({"username": user.username, "password": password})


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
