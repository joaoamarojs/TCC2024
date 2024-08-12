from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.response import Response
from .serializers import UserSerializer, UserProfileSerializer, BarracaSerializer, Barraca_FestaSerializer, Caixa_FestaSerializer, CartaoSerializer, ClienteSerializer, ColaboradorSerializer, EstoqueSerializer, FestaSerializer, Movimentacao_BarracaSerializer, Movimentacao_CaixaSerializer, ProdutoSerializer, Tipo_produtoSerializer
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


class Tipo_produtoDelete(generics.DestroyAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        return Tipo_produto.objects.filter()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
