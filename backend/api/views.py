from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, BarracaSerializer, Barraca_FestaSerializer, Caixa_FestaSerializer, CartaoSerializer, ClienteSerializer, ColaboradorSerializer, EstoqueSerializer, FestaSerializer, Movimentacao_BarracaSerializer, Movimentacao_CaixaSerializer, ProdutoSerializer, Tipo_produtoSerializer
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
        user = self.request.user
        return Barraca_Festa.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class Barraca_FestaDelete(generics.DestroyAPIView):
    serializer_class = Barraca_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Barraca_Festa.objects.filter(author=user)


class BarracaListCreate(generics.ListCreateAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Barraca.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class BarracaDelete(generics.DestroyAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Barraca.objects.filter(author=user)


class Caixa_FestaListCreate(generics.ListCreateAPIView):
    serializer_class = Caixa_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Caixa_Festa.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class Caixa_FestaDelete(generics.DestroyAPIView):
    serializer_class = Caixa_FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Caixa_Festa.objects.filter(author=user)


class CartaoListCreate(generics.ListCreateAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cartao.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class CartaoDelete(generics.DestroyAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cartao.objects.filter(author=user)


class ClienteListCreate(generics.ListCreateAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cliente.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class ClienteDelete(generics.DestroyAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cliente.objects.filter(author=user)        


class ColaboradorListCreate(generics.ListCreateAPIView):
    serializer_class = ColaboradorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Colaborador.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class ColaboradorDelete(generics.DestroyAPIView):
    serializer_class = ColaboradorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Colaborador.objects.filter(author=user)


class EstoqueListCreate(generics.ListCreateAPIView):
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Estoque.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class EstoqueDelete(generics.DestroyAPIView):
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Estoque.objects.filter(author=user) 


class FestaListCreate(generics.ListCreateAPIView):
    serializer_class = FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Festa.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class FestaDelete(generics.DestroyAPIView):
    serializer_class = FestaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Festa.objects.filter(author=user) 


class Movimentacao_BarracaListCreate(generics.ListCreateAPIView):
    serializer_class = Movimentacao_BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movimentacao_Barraca.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class Movimentacao_BarracaDelete(generics.DestroyAPIView):
    serializer_class = Movimentacao_BarracaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movimentacao_Barraca.objects.filter(author=user) 


class Movimentacao_CaixaListCreate(generics.ListCreateAPIView):
    serializer_class = Movimentacao_CaixaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movimentacao_Caixa.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class Movimentacao_CaixaDelete(generics.DestroyAPIView):
    serializer_class = Movimentacao_CaixaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Movimentacao_Caixa.objects.filter(author=user) 


class ProdutoListCreate(generics.ListCreateAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Produto.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class ProdutoDelete(generics.DestroyAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Produto.objects.filter(author=user)        


class Tipo_produtoListCreate(generics.ListCreateAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tipo_produto.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class Tipo_produtoDelete(generics.DestroyAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Tipo_produto.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
