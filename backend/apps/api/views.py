from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import Task, Project, ShareToken
from django.contrib.auth.models import User
from .serializers import TaskSerializer, ProjectSerializer
from django.shortcuts import get_object_or_404, redirect
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, AllowAny

class ProjectList(APIView):
    """
    Vista para crear y listar proyectos
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(users=request.user) # Unicamente los proyectos en lo que el usuario pertenece
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save()
            project.users.add(request.user) # Agrego el usuario que creo el proyecto como participante del mismo
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectDetail(APIView):
    """
    Vista para obtener, actualizar o eliminar un Proyecto especifico
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ProjectSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ProjectSerializer(project, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        project.delete()
        return Response({'message': 'Proyecto eliminado exitosamente'}, status=status.HTTP_204_NO_CONTENT)
    
class ShareProject(APIView):
    """
    Vista para compartir un enlace para unirte a un proyecto con token de autenticacion
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        share_token, created = ShareToken.objects.get_or_create(project=project)
        share_link = f"{request.scheme}://{request.get_host()}/api/join-project/{share_token.token}/"
        return Response({'share_link': share_link}, status=status.HTTP_200_OK)
    
class JoinProject(APIView):
    """
    Vista para unirse a un proyecto mediante un enlace compartido
    """
    permission_classes = [AllowAny]

    def post(self, request, token):
        if not request.user.is_authenticated:
            return redirect('auth/login/google-oauth2/')
        share_token = get_object_or_404(ShareToken, token=token)
        project = share_token.project
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        if user in project.users.all():
            return Response({'message': 'Ya eres parte de este proyecto'}, status=status.HTTP_400_BAD_REQUEST)
        project.users.add(user)
        return Response({'message': 'Te uniste al proyecto exitosamente'}, status=status.HTTP_200_OK)
    
class ManageParticipants(APIView):
    """
    Vista para agregar o eliminar un participante de un proyecto
    """
    def post(self, request, project_pk):
        """Agregar un participante al proyecto"""
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'Falta el ID del usuario'})
        user = get_object_or_404(User, pk=user_id)
        project.users.add(user)
        return Response({'message': 'Usuario agregado exitosamente'})
    
    def delete(self, request, project_pk):
        """Eliminar un participante"""
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'Falta el ID del usuario'})
        user = get_object_or_404(User, pk=user_id)
        project.users.remove(user)
        return Response({'message': 'Usuario eliminado exitosamente'})

class TaskList(APIView):
    """
    Vista para listar y crear tareas de un proyecto
    """
    def get(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        tasks = Task.objects.filter(project=project)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, project_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        serializer =TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetail(APIView):
    """
    Vista para obtener, actualizar o eliminar una tarea especifica
    """
    def get(self, request, project_pk, task_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        task = get_object_or_404(Task, pk=task_pk, project=project)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, project_pk, task_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        task = get_object_or_404(Task, pk=task_pk, project=project)
        serializer = TaskSerializer(task, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, project_pk, task_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        task = get_object_or_404(Task, pk=task_pk, project=project)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, project_pk, task_pk):
        project = get_object_or_404(Project, pk=project_pk, users=request.user)
        if not project:
            return Response({'error': 'Proyecto no encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        task = get_object_or_404(Task, pk=task_pk, project=project)
        task.delete()
        return Response({'message': 'Tarea eliminada con exito'}, status=status.HTTP_204_NO_CONTENT)

