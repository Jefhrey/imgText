from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from ocr.serializers import UserSerializer
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework.response import Response
from serializers import LoginSerializer



@ensure_csrf_cookie
@api_view(['GET'])
def get_csrf(request):
    return Response(
        {"message": "CSRF Token set"}
    )


@api_view(['GET'])
def checkLog(request):
    # if session cookie is found, the user is logged in.
    if request.user.is_authenticated:
        return Response({"isLoggedIn": True})
    else: 
        return Response({"isLoggedIn": False})
    

@api_view(["POST"])
@csrf_protect
def logIn(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(
        request,
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"]
    )

    if user is None:
        return Response(
            {"message": "Invalid credentials."},
            status=401
        )

    login(request, user)

    return Response(
        {"message": "Authentication successful."}
    )


@api_view(["POST"])
def sign_up(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)



    User.objects.create_user(
        username=serializer.validated_data["username"],
        password=serializer.validated_data["password"])

    return Response(
        {"message": "Account created successfully"}
    )
    

@api_view(['GET'])
def logOut(request):
    logout(request)
    return Response({"message": "Logged out successfully"}, status = 200)
