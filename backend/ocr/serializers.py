from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import User
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "date_joined"]



class LoginSerializer(serializers.Serializer):
    # Run this cmd in manage.py to see the error messages: shell print(serializers.CharField().error_messages)

# {'required': 'This field is required.', 'null': 'This field may not be null.', 'invalid': 'Not a valid string.', 'blank': 'This field may not be blank.', 'max_length': 'Ensure this field has no more than {max_length} characters.', 'min_length': 'Ensure this field has at least {min_length} characters.'}

    username = serializers.CharField(
                max_length=40,
                required=True,
                allow_blank=False,
                error_messages={
                    "required": "Username is required",
                    "blank": "Username can not be blank",
                    f"max_length": "Username must be less than {max_length} characters"
                }
                )
    password = serializers.CharField(
                min_length=8,
                required=True,
                allow_blank=False,
                error_messages={
                "required": "Password is required",
                "blank": "Password can not be blank",
                f"min_length": "Username must be greater than {min_length} characters"
            }
    )



class SignUpSerializer(LoginSerializer):
    username = serializers.CharField(
                max_length=40,
                required=True,
                allow_blank=False,
                validators=[UniqueValidator(queryset=User.objects.all(), message="Username already exists")],
                error_messages={
                    "required": "Username is required",
                    "blank": "Username can not be blank",
                    f"max_length": "Username must be less than {max_length} characters"
                }
                )