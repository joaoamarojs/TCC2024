import os
import json
from django.db import IntegrityError
from django.forms import ValidationError
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .permissions import IsInGroup, IsInBarracaOrCaixaGroup
from .serializers import UserSerializer, UserProfileSerializer, BarracaSerializer, Barraca_FestaSerializer, Caixa_FestaSerializer, CartaoSerializer, ClienteSerializer, EstoqueSerializer, FestaSerializer, GroupSerializer, Movimentacao_BarracaSerializer, Movimentacao_CaixaSerializer, Movimentacao_ProdutoSerializer, Produto_FestaSerializer, ProdutoSerializer, Tipo_produtoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models.barraca_festa import Barraca_Festa
from .models.barraca import Barraca
from .models.caixa_festa import Caixa_Festa
from .models.cartao import Cartao
from .models.cliente import Cliente
from .models.estoque import Estoque
from .models.festa import Festa
from .models.movimentacao_barraca import Movimentacao_Barraca
from .models.movimentacao_caixa import Movimentacao_Caixa
from .models.movimentacao_produto import Movimentacao_Produto
from .models.produto import Produto
from .models.produto_festa import Produto_Festa
from .models.tipo_produto import Tipo_produto

JSON_FILE_PATH = 'config_cartao.json'

class AdminstrativoGroup(IsInGroup):
    def __init__(self):
        super().__init__('Administrativo')


class BarracaGroup(IsInGroup):
    def __init__(self):
        super().__init__('Barraca')


class CaixaGroup(IsInGroup):
    def __init__(self):
        super().__init__('Caixa')   


class Barraca_FestaListCreate(generics.ListCreateAPIView):
    serializer_class = Barraca_FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        try:
            festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
            if festa_atual:
                return Barraca_Festa.objects.filter(festa=festa_atual)
            else:
                return Barraca_Festa.objects.none()
        except Festa.DoesNotExist:
            return Barraca_Festa.objects.none()

    def list(self, request, *args, **kwargs):
        relatorio = self.request.query_params.get('relatorio', 'false').lower() == 'true'
        festa = self.request.query_params.get('festa')

        if relatorio:
            festa = Festa.objects.filter(id=festa).first()
            if festa:
                queryset = Barraca_Festa.objects.filter(festa=festa).select_related('barraca').values(
                    'barraca__id', 'barraca__nome'
                ).distinct()

                barracas_unicas = list(queryset)

                return Response(barracas_unicas, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Nenhuma festa atual disponível."}, status=status.HTTP_200_OK)
        
        # Comportamento padrão, caso relatorio=false ou não esteja presente
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_atual:
            serializer.save(festa=festa_atual)
        else:
            return Response({"message": ["Nenhuma festa atual disponível para associar."]}, status=status.HTTP_400_BAD_REQUEST)
        

class Barraca_FestaDelete(generics.DestroyAPIView):
    serializer_class = Barraca_FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Barraca_Festa.objects.filter()
    

class BarracaListActives(generics.ListAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Barraca.objects.filter(ativo=True)    


class BarracaListCreate(generics.ListCreateAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Barraca.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
            

class BarracaUpdate(generics.UpdateAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Barraca.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"message": "ID precisa estar preenchido para atualizar."},status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class BarracaDelete(generics.DestroyAPIView):
    serializer_class = BarracaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Barraca.objects.filter()


class Caixa_FestaListCreate(generics.ListCreateAPIView):
    serializer_class = Caixa_FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        return Caixa_Festa.objects.filter(festa=festa_atual) if festa_atual else Caixa_Festa.objects.none()
    
    def list(self, request, *args, **kwargs):
        relatorio = self.request.query_params.get('relatorio', 'false').lower() == 'true'
        festa_id = self.request.query_params.get('festa')

        # Verifica se o parâmetro 'festa' foi passado
        if festa_id and relatorio:
            festa = Festa.objects.filter(id=festa_id).first()
            if festa:
                # Filtra os caixas relacionados à festa
                queryset = Caixa_Festa.objects.filter(festa=festa).select_related('user_caixa').values(
                    'id', 'user_caixa__username', 'iniciado', 'finalizado', 'troco_inicial'
                )
                caixas_festa = list(queryset)

                return Response(caixas_festa, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Festa não encontrada."}, status=status.HTTP_400_BAD_REQUEST)

        # Comportamento padrão se nenhum parâmetro 'festa' for passado
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if not festa_atual:
            return Response({"message": "Nenhuma festa atual disponível para associar."},status=status.HTTP_400_BAD_REQUEST)
        
        user_caixa = serializer.validated_data.get('user_caixa')
        if Caixa_Festa.objects.filter(festa=festa_atual, user_caixa=user_caixa).exists():
            return Response({"message": "Este caixa já está associado à festa atual."},status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(festa=festa_atual)


class Caixa_FestaDelete(generics.DestroyAPIView):
    serializer_class = Caixa_FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Caixa_Festa.objects.filter()
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.iniciado:
            return Response({"message": "Caixa já iniciado."}, status=status.HTTP_400_BAD_REQUEST)

        instance.delete()
        return Response({"message": "Caixa excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)


class CartaoListCreate(generics.ListCreateAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Cartao.objects.filter()

    def post(self, request, *args, **kwargs):
        quantidade = request.data.get('quantidade')

        if not quantidade or not isinstance(quantidade, int) or quantidade <= 0:
            return Response({'error': 'A quantidade deve ser um número inteiro maior que zero.'}, status=status.HTTP_400_BAD_REQUEST)

        cliente_id = 1
        novos_cartoes_ids = []
        ativo = True

        for _ in range(quantidade):
            cartao = Cartao(cliente_id=cliente_id,ativo=ativo)
            cartao.save()
            novos_cartoes_ids.append(cartao.id)

        return Response({'novos_cartoes_ids': novos_cartoes_ids}, status=status.HTTP_201_CREATED)


class CartaoUpdate(generics.UpdateAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Cartao.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            raise ValidationError({"message": "ID precisa estar preenchido para atualizar."})
        return super().update(request, *args, **kwargs)


class CartaoDelete(generics.DestroyAPIView):
    serializer_class = CartaoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Cartao.objects.filter()


class ClienteListCreate(generics.ListCreateAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Cliente.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class ClienteUpdateView(generics.UpdateAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Cliente.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"message": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class ClienteDelete(generics.DestroyAPIView):
    serializer_class = ClienteSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Cliente.objects.filter()        


class EstoqueListCreate(generics.ListCreateAPIView):
    serializer_class = EstoqueSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_atual:
            return Estoque.objects.filter(festa=festa_atual)
        else:
            return Estoque.objects.none()

    def post(self, request, *args, **kwargs):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        
        if festa_atual:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(festa=festa_atual)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_400_BAD_REQUEST)
        

class EstoqueDelete(generics.DestroyAPIView):
    serializer_class = EstoqueSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Estoque.objects.filter()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        produto = instance.produto
        festa = instance.festa

        total_estoque = Estoque.objects.filter(produto=produto, festa=festa).exclude(id=instance.id).aggregate(total=models.Sum('quant'))['total'] or 0

        total_vendido = Movimentacao_Produto.objects.filter(
            produto=produto, 
            movimentacao__festa=festa
        ).aggregate(total=models.Sum('qtd'))['total'] or 0

        if total_estoque < total_vendido:
            return Response({"message": "Não é possível excluir o estoque, pois a quantidade vendida supera a quantidade disponível no estoque."},status=status.HTTP_400_BAD_REQUEST)

        return super().delete(request, *args, **kwargs)


class FestaListCreate(generics.ListCreateAPIView):
    serializer_class = FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Festa.objects.all() 

    def create(self, request, *args, **kwargs):
        if Festa.objects.filter(fechada=False).exists():
            return Response({"message": "Ainda possui festa em aberto."}, status=status.HTTP_404_NOT_FOUND)
        
        return super().create(request, *args, **kwargs)


class FestaAtual(generics.GenericAPIView):
    serializer_class = FestaSerializer
    permission_classes = [IsAuthenticated] 

    def get(self, request, *args, **kwargs):
        try:
            festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
            if festa_atual:
                serializer = self.get_serializer(festa_atual)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_200_OK)
        except Festa.DoesNotExist:
            return Response({"message": "Erro ao buscar festa."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


class FestaAtualInfo(APIView):
    permission_classes = [AdminstrativoGroup]

    def get(self, request, *args, **kwargs):
        try:
            festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()

            festa_anterior = Festa.objects.filter(fechada=True, data_inicio__lt=festa_atual.data_inicio).order_by('-data_inicio').first() if festa_atual else None

            if festa_atual:
                barracas_ativas = Barraca_Festa.objects.filter(festa=festa_atual, barraca__ativo=True).distinct('barraca').count()  # Usar distinct para evitar duplicidade
                caixas_ativas = Caixa_Festa.objects.filter(festa=festa_atual).count()
                cartoes_ativos = Cartao.objects.filter(ativo=True).count()

                produtos_festa_atual = Produto_Festa.objects.filter(festa=festa_atual).select_related('produto')

                movimentacoes_atual = Movimentacao_Produto.objects.filter(movimentacao__festa=festa_atual).values('produto__nome').annotate(
                    qtd_vendida_atual=models.Sum('qtd', output_field=models.IntegerField())
                )

                movimentacoes_anterior = {}
                if festa_anterior:
                    movimentacoes_anterior = Movimentacao_Produto.objects.filter(movimentacao__festa=festa_anterior).values('produto__nome').annotate(
                        qtd_vendida_anterior=models.Sum('qtd', output_field=models.IntegerField())
                    )
                    movimentacoes_anterior = {item['produto__nome']: item['qtd_vendida_anterior'] for item in movimentacoes_anterior}

                produtos = []
                qtd_vendida_atual = []
                qtd_vendida_anterior = []

                for produto_festa in produtos_festa_atual:
                    produto_nome = produto_festa.produto.nome
                    qtd_atual = next((mov['qtd_vendida_atual'] for mov in movimentacoes_atual if mov['produto__nome'] == produto_nome), 0)
                    qtd_anterior = movimentacoes_anterior.get(produto_nome, 0)

                    produtos.append(produto_nome)
                    qtd_vendida_atual.append(qtd_atual)
                    qtd_vendida_anterior.append(qtd_anterior)

                barracas_festa_atual = Barraca_Festa.objects.filter(festa=festa_atual).select_related('barraca').distinct('barraca')

                vendas_barracas = Movimentacao_Barraca.objects.filter(festa=festa_atual).values('barraca__nome').annotate(
                    total_vendas=models.functions.Coalesce(models.Sum('valor', output_field=models.DecimalField()), models.Value(0), output_field=models.DecimalField()) 
                )

                vendas_barracas_dict = {venda['barraca__nome']: venda['total_vendas'] for venda in vendas_barracas}

                nomes_barracas = []
                total_vendas_barracas = []

                for barraca_festa in barracas_festa_atual:
                    barraca_nome = barraca_festa.barraca.nome
                    total_vendas = vendas_barracas_dict.get(barraca_nome, 0)

                    nomes_barracas.append(barraca_nome)
                    total_vendas_barracas.append(float(total_vendas)) 

                data = {
                    'festa': festa_atual.nome,
                    'barracas_ativas': barracas_ativas,
                    'caixas_ativas': caixas_ativas,
                    'cartoes_ativos': cartoes_ativos,
                    'produtos': produtos,
                    'qtd_vendida_atual': qtd_vendida_atual,
                    'qtd_vendida_anterior': qtd_vendida_anterior,
                    'nomes_barracas': nomes_barracas,
                    'total_vendas_barracas': total_vendas_barracas,
                }

                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"message": f"Erro ao buscar festa: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class FecharCaixa(APIView):
    permission_classes = [AdminstrativoGroup] 
    def post(self, request, *args, **kwargs):

        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()

        if festa_atual:    
            caixa = request.data.get('caixa')
            troco = request.data.get('troco_final')

            if not caixa:
                return Response({"message": "Caixa não fornecido."}, status=status.HTTP_400_BAD_REQUEST)

            if not troco:
                return Response({"message": "Troco final não fornecido."}, status=status.HTTP_400_BAD_REQUEST)

            caixa_festa = Caixa_Festa.objects.filter(id=caixa).first()

            if caixa_festa:
                caixa_festa.finalizado = True
                caixa_festa.troco_final = troco
                caixa_festa.save()
                return Response({"message": "Caixa fechado com sucesso."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Caixa não encontrado na festa_atual."}, status=status.HTTP_404_NOT_FOUND)  
        else:
            return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_400_BAD_REQUEST)      

class FecharFesta(APIView):
    permission_classes = [AdminstrativoGroup] 
    def post(self, request, *args, **kwargs):
        password = request.data.get('password')

        if not password:
            return Response({"message": "Senha não fornecida."}, status=status.HTTP_400_BAD_REQUEST)

        if password != settings.SENHA_FECHA_FESTA:
            return Response({"message": "Senha inválida."}, status=status.HTTP_403_FORBIDDEN)

        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()

        if festa_atual:
            caixas_abertos = Caixa_Festa.objects.filter(festa=festa_atual, finalizado=False).exists()
            
            if caixas_abertos:
                return Response(
                    {"message": "Não é possível fechar a festa enquanto houver caixas em aberto."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            festa_atual.fechada = True
            festa_atual.save()
            return Response({"message": "Festa fechada com sucesso."}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_404_NOT_FOUND)


class FestaDelete(generics.DestroyAPIView):
    serializer_class = FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Festa.objects.filter() 


class Movimentacao_BarracaListCreate(generics.ListCreateAPIView):
    serializer_class = Movimentacao_BarracaSerializer
    permission_classes = [BarracaGroup]

    def get_queryset(self):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_atual:
            barraca_id = self.request.query_params.get('barraca', None)
            if barraca_id:
                return Movimentacao_Barraca.objects.filter(barraca=barraca_id)
            return Movimentacao_Barraca.objects.all()
        return Movimentacao_Barraca.objects.none()

    def post(self, request, *args, **kwargs):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()

        if not festa_atual:
            return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_400_BAD_REQUEST)

        barracas_do_usuario = Barraca_Festa.objects.filter(user_responsavel=request.user, festa=festa_atual)
        if not barracas_do_usuario.exists():
            return Response({"message": "O usuário não possui barracas associadas a esta festa."}, status=status.HTTP_400_BAD_REQUEST)

        barraca = barracas_do_usuario.first().barraca

        cartao_id = request.data.get('cartao')
        cartao_obj = get_object_or_404(Cartao, id=cartao_id)

        total_caixa = Movimentacao_Caixa.objects.filter(cartao=cartao_obj, festa=festa_atual).aggregate(total=models.Sum('valor'))['total'] or 0
        total_barraca = Movimentacao_Barraca.objects.filter(cartao=cartao_obj, festa=festa_atual).aggregate(total=models.Sum('valor'))['total'] or 0
        saldo = total_caixa - total_barraca

        if saldo <= 0 or saldo < request.data.get('valor'):
            return Response({"message": "Saldo insuficiente."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not cartao_obj.ativo:
            return Response({"message": "Cartão inativo ou invalido."}, status=status.HTTP_400_BAD_REQUEST)

        produtos = request.data.get('produtos', None)
        if not produtos:
            return Response({"message": "Produtos não fornecidos."}, status=status.HTTP_400_BAD_REQUEST)

        produtos_com_estoque_insuficiente = []

        for produto_data in produtos:
            produto_id = produto_data.get('produto')
            qtd_solicitada = produto_data.get('qtd')

            produto_obj = get_object_or_404(Produto, id=produto_id)

            if produto_obj.estocavel:
                total_estoque = Estoque.objects.filter(produto=produto_obj, festa=festa_atual).aggregate(total=models.Sum('quant'))['total'] or 0
                
                total_vendido = Movimentacao_Produto.objects.filter(
                    movimentacao__festa=festa_atual,
                    produto=produto_obj
                ).aggregate(total=models.Sum('qtd'))['total'] or 0

                estoque_disponivel = total_estoque - total_vendido

                if total_estoque == 0:
                    produtos_com_estoque_insuficiente.append({
                        "produto": produto_obj.nome,
                        "estoque_disponivel": 0,
                        "qtd_solicitada": qtd_solicitada,
                        "mensagem": "Sem estoque disponível."
                    })
                elif estoque_disponivel < qtd_solicitada:
                    produtos_com_estoque_insuficiente.append({
                        "produto": produto_obj.nome,
                        "estoque_disponivel": estoque_disponivel,
                        "qtd_solicitada": qtd_solicitada
                    })

        if produtos_com_estoque_insuficiente:
            return Response({
                "message": "Estoque insuficiente para um ou mais produtos.",
                "detalhes": produtos_com_estoque_insuficiente
            }, status=status.HTTP_400_BAD_REQUEST)

        movimentacao_barraca = Movimentacao_Barraca(
            festa=festa_atual,
            user_barraca=request.user,
            barraca=barraca,
            cartao=cartao_obj,
            valor=request.data.get('valor'),  
            desc=request.data.get('desc')  
        )
        movimentacao_barraca.save()

        for produto_data in produtos:
            Movimentacao_Produto.objects.create(
                movimentacao=movimentacao_barraca,
                produto_id=produto_data.get('produto'),
                qtd=produto_data.get('qtd')
            )

        return Response({"message": "Movimentação criada com sucesso!"}, status=status.HTTP_201_CREATED)


class Movimentacao_CaixaListCreate(generics.ListCreateAPIView):
    serializer_class = Movimentacao_CaixaSerializer
    permission_classes = [CaixaGroup]

    def get_queryset(self):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_atual:
            user_caixa_id = self.request.query_params.get('user_caixa', None)
            if user_caixa_id:
                return Movimentacao_Caixa.objects.filter(user_caixa=user_caixa_id)
            else:
                return Movimentacao_Caixa.objects.all()
        else:
            return Movimentacao_Caixa.objects.none()

    def post(self, request, *args, **kwargs):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()

        if not festa_atual:
            return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_400_BAD_REQUEST)
        
        cartao_id = request.data.get('cartao')
        cartao_obj = get_object_or_404(Cartao, id=cartao_id)

        if not cartao_obj.ativo or not cartao_obj:
            return Response({"message": "Cartão inativo ou invalido."}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.data.get('forma_pagamento') == '':
            return Response({"message": "Informe uma forma de pagamento."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(festa=festa_atual, user_caixa=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class Movimentacao_CaixaDelete(generics.DestroyAPIView):
    serializer_class = Movimentacao_CaixaSerializer
    permission_classes = [IsInBarracaOrCaixaGroup]

    def get_queryset(self):
        
        return Movimentacao_Caixa.objects.filter()


class Produto_FestaListCreate(generics.ListCreateAPIView):
    serializer_class = Produto_FestaSerializer
    permission_classes = [AdminstrativoGroup] 

    def get_queryset(self):
        festa_id = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if festa_id is not None:
            return Produto_Festa.objects.filter(festa=festa_id)
        return Produto_Festa.objects.none()

    def post(self, request, *args, **kwargs):
        festa_id = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        produto_id = request.data.get('produto')
        
        if Produto_Festa.objects.filter(festa=festa_id, produto=produto_id).exists():
            return Response(
                {"message": "Produto já possui valor."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(festa=festa_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class Produto_FestaList(generics.ListAPIView):
    serializer_class = Produto_FestaSerializer
    permission_classes = [IsInBarracaOrCaixaGroup]

    def get_queryset(self):
        festa_id = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        barraca_id = self.kwargs.get('barraca_id')

        if festa_id is not None:
            if barraca_id is not None:
                produtos_da_barraca = Produto.objects.filter(barraca=barraca_id)
                return Produto_Festa.objects.filter(festa=festa_id, produto__in=produtos_da_barraca)
            else:
                return Produto_Festa.objects.filter(festa=festa_id)

        return Produto_Festa.objects.none()

class Produto_FestaUpdate(generics.UpdateAPIView):
    queryset = Produto_Festa.objects.all()
    serializer_class = Produto_FestaSerializer
    permission_classes = [AdminstrativoGroup] 

    def get_object(self):
        try:
            return Produto_Festa.objects.get(pk=self.kwargs['pk'])
        except ObjectDoesNotExist:
            return Response({"message": "Produto não encontrado."}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        try:
            serializer.save()
        except ValidationError as e:
            return Response({"message": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)
        

class Produto_FestaDelete(generics.DestroyAPIView):
    queryset = Produto_Festa.objects.all()
    serializer_class = Produto_FestaSerializer
    permission_classes = [AdminstrativoGroup]

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response({"message": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"errors": e.message_dict}, status=status.HTTP_400_BAD_REQUEST)        


class ProdutoListCreate(generics.ListCreateAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Produto.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class ProdutoUpdate(generics.UpdateAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Produto.objects.filter()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"message": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)


class ProdutoDelete(generics.DestroyAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Produto.objects.filter()    


class ProdutosFestaAtualList(generics.ListAPIView):
    serializer_class = ProdutoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
            if festa_atual:
                barracas_da_festa = Barraca_Festa.objects.filter(festa=festa_atual).values_list('barraca', flat=True)
                return Produto.objects.filter(barraca__in=barracas_da_festa)
            else:
                return Produto.objects.none() 
        except ObjectDoesNotExist:
            return Produto.objects.none() 
        

class SaldoCartao(APIView):
    permission_classes = [IsInBarracaOrCaixaGroup]

    def get(self, request, cartao):
        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()

        try:
            cartao_obj = Cartao.objects.get(id=cartao)
        except Cartao.DoesNotExist:
            return Response({"message": "Cartão inativo ou invalido."}, status=status.HTTP_404_NOT_FOUND)
         
        if not cartao_obj.ativo:
            return Response({"message": "Cartão inativo ou invalido."}, status=status.HTTP_400_BAD_REQUEST)

        total_caixa = Movimentacao_Caixa.objects.filter(cartao=cartao_obj, festa=festa_atual).aggregate(total=models.Sum('valor'))['total'] or 0

        total_barraca = Movimentacao_Barraca.objects.filter(cartao=cartao_obj, festa=festa_atual).aggregate(total=models.Sum('valor'))['total'] or 0

        saldo = total_caixa - total_barraca

        return Response({"cartao_id": cartao_obj.id, "saldo": saldo}, status=status.HTTP_200_OK)   
        

class Tipo_produtoListCreate(generics.ListCreateAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Tipo_produto.objects.filter()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class Tipo_produtoUpdate(generics.UpdateAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return Tipo_produto.objects.filter()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"message": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)            


class Tipo_produtoDelete(generics.DestroyAPIView):
    serializer_class = Tipo_produtoSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return Tipo_produto.objects.filter()


class UserCreateList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AdminstrativoGroup]

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
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        return User.objects.all()

    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk', None)
        if not pk:
            return Response({"message": "ID precisa estar preenchido para atualizar."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)
    

class UserDeleteView(generics.DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [AdminstrativoGroup]

    def get_queryset(self):
        
        return User.objects.filter()  


class GroupUsersListView(APIView):
    permission_classes = [AdminstrativoGroup]
    
    def get(self, request, pk, format=None):
        group = get_object_or_404(Group, pk=pk)
        users = User.objects.filter(groups=group, is_active=True)
        serializer = UserProfileSerializer(users, many=True)
        return Response(serializer.data) 
    

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
            festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
            caixa_festa = Caixa_Festa.objects.filter(festa=festa_atual, user_caixa=user).first()
            if group.id in [3] and caixa_festa.finalizado == True:
                return Response({'detail': 'Caixa Fechado. Obrigado pela colaboração!'}, status=status.HTTP_403_FORBIDDEN)
            else:
                if group.id in [3] and caixa_festa.iniciado == False:
                    caixa_festa.iniciado = True
                    caixa_festa.save()

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
            return Response({'detail': 'Tipo de client invalido.'}, status=status.HTTP_400_BAD_REQUEST)
        

class ValidaUser(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FestaSerializer

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"message": "ID do usuário não fornecido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        festa_atual = Festa.objects.filter(fechada=False).order_by('-data_inicio').first()
        if not festa_atual:
            return Response({"message": "Nenhuma festa em aberto."}, status=status.HTTP_404_NOT_FOUND)

        barraca_festa = Barraca_Festa.objects.filter(festa=festa_atual, user_responsavel=user).first()
        caixa_festa = Caixa_Festa.objects.filter(festa=festa_atual, user_caixa=user).first()

        if barraca_festa:
            return Response({
                "message": "Usuário válido para a festa atual.",
                "funcao": "Barraca",
                "barraca": {
                    "codigo": barraca_festa.barraca.id,
                    "nome": barraca_festa.barraca.nome
                }
            }, status=status.HTTP_200_OK)
        elif caixa_festa:
            return Response({
                "message": "Usuário válido para a festa atual.",
                "funcao": "Caixa"
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Usuário não está associado à festa atual."}, status=status.HTTP_404_NOT_FOUND)



class ConfigCartao(generics.GenericAPIView):
    permission_classes = [AdminstrativoGroup] 

    def get(self, request, *args, **kwargs):
        dados = []
        if os.path.exists(JSON_FILE_PATH):
            with open(JSON_FILE_PATH, 'r') as f:
                dados = json.load(f)
        
        return Response(dados,  status=status.HTTP_200_OK)  

    def post(self, request, *args, **kwargs):
        titulo = request.data.get('titulo')
        fonte = request.data.get('fonte')
        tamanho = request.data.get('tamanho')
        cor = request.data.get('cor')
        cor_cartao = request.data.get('cor_cartao')

        if not all([titulo, fonte, tamanho, cor, cor_cartao]):
            return Response({'status': 'erro', 'message': 'Todos os campos são obrigatórios!'}, status=status.HTTP_400_BAD_REQUEST)

        dados = {
            'titulo': titulo,
            'fonte': fonte,
            'tamanho': tamanho,
            'cor': cor,
            'cor_cartao': cor_cartao,
        }

        with open(JSON_FILE_PATH, 'w') as f:
            json.dump(dados, f, indent=4)

        return Response({'status': 'sucesso', 'message': 'Dados salvos com sucesso!'}, status=status.HTTP_200_OK)  
