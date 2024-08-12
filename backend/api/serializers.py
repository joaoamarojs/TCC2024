from django.contrib.auth.models import User
from rest_framework import serializers
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user    
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Adicione outros campos se necessário

class Barraca_FestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barraca_Festa
        fields = ["id", "barraca", "festa", "user_responsavel"]  


class BarracaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Barraca
        fields = ["id", "nome", "ativo", "dataCriacao"]  


class Caixa_FestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caixa_Festa
        fields = ["id", "festa", "user_caixa"]          
        

class CartaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cartao
        fields = ["id", "cliente", "ativo"]      


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ["id", "nome", "data_nascimento", "cpf", "ativo"]     


class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = ["id", "nome", "data_nascimento", "ativo"]  


class EstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estoque
        fields = ["id", "produto", "quant", "data", "festa"]  


class FestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Festa
        fields = ["id", "nome", "data_inicio", "fechada"]  


class Movimentacao_BarracaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao_Barraca
        fields = ["id", "desc", "cartao", "festa", "valor", "user_barraca", "barraca"]  


class Movimentacao_CaixaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimentacao_Caixa
        fields = ["id", "desc", "cartao", "festa", "valor", "user_caixa"]  


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ["id", "nome", "barraca", "tipo_produto", "dataCriacao"]


class Tipo_produtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo_produto
        fields = ["id", "nome", "dataCriacao"]        