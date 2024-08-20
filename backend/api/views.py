from django.shortcuts import render
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from .serializers import UserSerializer, UserProfileSerializer, BarracaSerializer, Barraca_FestaSerializer, Caixa_FestaSerializer, CartaoSerializer, ClienteSerializer, ColaboradorSerializer, EstoqueSerializer, FestaSerializer, GroupSerializer, Movimentacao_BarracaSerializer, Movimentacao_CaixaSerializer, ProdutoSerializer, Tipo_produtoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models.barraca_festa import Barraca_Festa
from .models.barraca import Barraca
from .models.caixa_festa import Caixa_Festa
from .models.cartao import Cartao
from .models.cliente import Cliente
from .models.colaborador import Colaborador
from .models.estoque import Estoque
from .models.festa import Festa
from .models.movimentacao_barraca import Movimentacao_Barraca
from .models.movimentacao_caixa import Movimentacao_Caixa
from .models.produto import Produto
from .models.tipo_produto import Tipo_produto


class Barraca_FestaListCreate(generics.ListCreateAPIView):
    serializer_class = Barraca_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Barraca_Festa.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class Barraca_FestaDelete(generics.DestroyAPIView):
    serializer_class = Barraca_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Barraca_Festa.objects.filter()


class BarracaListCreate(generics.ListCreateAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Barraca.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class BarracaUpdate(generics.UpdateAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Barraca.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"detail": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class BarracaDelete(generics.DestroyAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Barraca.objects.filter()


class Caixa_FestaListCreate(generics.ListCreateAPIView):
    serializer_class = Caixa_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Caixa_Festa.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class Caixa_FestaDelete(generics.DestroyAPIView):
    serializer_class = Caixa_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Caixa_Festa.objects.filter()


class CartaoListCreate(generics.ListCreateAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Cartao.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class CartaoDelete(generics.DestroyAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Cartao.objects.filter()


class ClienteListCreate(generics.ListCreateAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Cliente.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class ClienteUpdateView(generics.UpdateAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cliente.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"detail": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class ClienteDelete(generics.DestroyAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Cliente.objects.filter()        


class ColaboradorListCreate(generics.ListCreateAPIView):
    serializer_class = ColaboradorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Colaborador.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class ColaboradorUpdate(generics.UpdateAPIView):
    serializer_class = ColaboradorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"detail": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class ColaboradorDelete(generics.DestroyAPIView):
    serializer_class = ColaboradorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Colaborador.objects.filter()


class EstoqueListCreate(generics.ListCreateAPIView):
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Estoque.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class EstoqueDelete(generics.DestroyAPIView):
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Estoque.objects.filter() 


class FestaListCreate(generics.ListCreateAPIView):
    serializer_class = FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Festa.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class FestaDelete(generics.DestroyAPIView):
    serializer_class = FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Festa.objects.filter() 


class Movimentacao_BarracaListCreate(generics.ListCreateAPIView):
    serializer_class = Movimentacao_BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Movimentacao_Barraca.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class Movimentacao_BarracaDelete(generics.DestroyAPIView):
    serializer_class = Movimentacao_BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Movimentacao_Barraca.objects.filter() 


class Movimentacao_CaixaListCreate(generics.ListCreateAPIView):
    serializer_class = Movimentacao_CaixaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Movimentacao_Caixa.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class Movimentacao_CaixaDelete(generics.DestroyAPIView):
    serializer_class = Movimentacao_CaixaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Movimentacao_Caixa.objects.filter() 


class ProdutoListCreate(generics.ListCreateAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Produto.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class ProdutoUpdate(generics.UpdateAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Produto.objects.filter()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"detail": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class ProdutoDelete(generics.DestroyAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Produto.objects.filter()        


class Tipo_produtoListCreate(generics.ListCreateAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Tipo_produto.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class Tipo_produtoUpdate(generics.UpdateAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tipo_produto.objects.filter()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"detail": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)            


class Tipo_produtoDelete(generics.DestroyAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Tipo_produto.objects.filter()


class UserCreateList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return User.objects.filter()


class UserProfileView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"detail": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)
    

class UserDeleteView(generics.DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return User.objects.filter()    
    

class GroupListView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]    


class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]  
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        client_type = request.headers.get('client_type')
        
        if not client_type:
            return Response({'detail': 'Header "client_type" is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
            return Response({'detail': 'Usuario ou senha invalidos.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            group = Group.objects.get(user=user)
        except Group.DoesNotExist:
            return Response({'detail': 'Esse usuario não possui grupo.'}, status=status.HTTP_400_BAD_REQUEST)

        if client_type == 'web' and group.id in [2, 3]:
            return Response({'detail': 'Usuarios não Administrativos não podem acessar o web.'}, status=status.HTTP_403_FORBIDDEN)
        elif client_type == 'mobile' and group.id in [1]:
            return Response({'detail': 'Usuarios Administrativos não podem acessar o mobile.'}, status=status.HTTP_403_FORBIDDEN)
        elif client_type == 'mobile' and group.id in [2, 3]:
            token = RefreshToken.for_user(user)
            return Response({
                'access': str(token.access_token),
                'refresh': str(token)
            })
        elif client_type == 'web' and group.id == 1:
            token = RefreshToken.for_user(user)
            return Response({
                'access': str(token.access_token),
                'refresh': str(token)
            })
        else:
            return Response({'detail': 'Invalid client type.'}, status=status.HTTP_400_BAD_REQUEST)