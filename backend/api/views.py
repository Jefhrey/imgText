from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
# Create your views here.
def ocr_space(image_file):
    response = requests.post(
        "https://api.ocr.space/parse/image",
        files={"file": image_file},
        data={
            "apikey": "K88349390888957",
            "language": "eng",
        },
    )
    return response.json()


@api_view(["POST"])
def sendText(request):
    img = request.FILES["image"]
    print(img.name)
    print(img.size)
    result = ocr_space(img)
    result = result["ParsedResults"]
    result = result[0]
    result = result["ParsedText"]
    print(result)
    return Response({"message": result})
