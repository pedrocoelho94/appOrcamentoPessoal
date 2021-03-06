class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor  
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd{
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){ //objeto literam -> JSON
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        //array despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        //recuperar todas as despesas cadastradas em localStorage
        for(let i = 1; i <= id; i++){
            //recuperar despesa //json -> objeto literal
            let despesa = JSON.parse(localStorage.getItem(i))   
            //existe a possibilidade de ter indice que foram removidos
            if(despesa === null){
                //pula o atual
                continue
            }
            despesa.id = i   
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array ()
        despesasFiltradas = this.recuperarTodosRegistros()
        //console.log(despesa)
        //console.log(despesasFiltradas)
        //ano
        if(despesa.ano != ""){
            despesasFiltradas = despesasFiltradas.filter(f => f.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ""){
            despesasFiltradas = despesasFiltradas.filter(f => f.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ""){
            despesasFiltradas = despesasFiltradas.filter(f => f.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ""){
            despesasFiltradas = despesasFiltradas.filter(f => f.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ""){
            despesasFiltradas = despesasFiltradas.filter(f => f.descricao == despesa.descricao)
        }
       //valor
       if(despesa.valor != ""){
            despesasFiltradas = despesasFiltradas.filter(f => f.valor == despesa.valor)
        }
        //console.log(despesasFiltradas)
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')


    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value, )

    if(despesa.validarDados()){
        bd.gravar(despesa)     
        document.getElementById('modalTitulo').innerHTML = 'Registro inserido com sucesso!'
        document.getElementById('modalTituloDiv').className = 'modal-header text-success'
        document.getElementById('modalTexto').innerHTML = 'A despesa foi cadastrada com sucesso.'
        document.getElementById('modalBotao').className = 'btn btn-success'
        document.getElementById('modalBotao').innerHTML = 'Fechar'

        $('#modalRegistraDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }else{
        document.getElementById('modalTitulo').innerHTML = 'Erro na inclus??o do registro!'
        document.getElementById('modalTituloDiv').className = 'modal-header text-danger'
        document.getElementById('modalTexto').innerHTML = 'Erro na grava????o. Verifique se todos os campos foram preenchidos corretamente.'
        document.getElementById('modalBotao').className = 'btn btn-danger'
        document.getElementById('modalBotao').innerHTML = 'Voltar e corrgir'

        $('#modalRegistraDespesa').modal('show')
    }    
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    
    //selecionando tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    //console.log(despesas);
    //percorrer o array despesa, listando cada despesa de forma dinamica
    despesas.forEach(function(d){
        //console.log(d)
        //criando a linha (tr)
        let linha = listaDespesas.insertRow()
        //listaDespesas.innerHTML += `<tr><td>${d.dia}/${d.mes}/${d.ano}</td><td>${d.tipo}</td><td>${d.descricao}</td><td>${d.valor}</td></tr>`
        
        //criar  as colunas(td)

        
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        //ajustar o tipo   
        switch(d.tipo){
            case '1': d.tipo = 'Alimenta????o'
            break
            case '2': d.tipo = 'Educa????o'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Sa??de'
            break
            case '5': d.tipo = 'Transporte'
            break
        }

        linha.insertCell(1).innerHTML = `${d.tipo}`
        linha.insertCell(2).innerHTML = `${d.descricao}`
        linha.insertCell(3).innerHTML = `${d.valor}`
        //bot??o excluir
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //remover despesa
            let id = this.id.replace('id_despesa_', '')
            //alert(id)
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    console.log(despesas)
    
    carregaListaDespesas(despesas, true)

}