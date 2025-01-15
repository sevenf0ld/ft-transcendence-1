from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.http import Http404

def index(request):
    return render(request, 'index.html')

def custom_invalid_api(request, exception=None):
    #return JsonResponse({'error': 'Not Found'}, status=404)
    return render(request, 'index.html')
