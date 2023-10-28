let qs = (e) => document.querySelector(e)
let qsa = (e) => document.querySelectorAll(e)
let qtdDigitos = [];
let key = 0;
let numVoto = "";
let vereadorVoto = "";
let prefeitoVoto = "";
let sessaoAtual = "vereador"
let telaInicial

function sessao() {
    qtdDigitos = [];

    if (sessaoAtual == "vereador") {
        qs(".numeros-cargo").innerHTML = ""
        for (let i = 0; i < 5; i++) {
            let div = document.createElement("div")
            qs(".numeros-cargo").appendChild(div)
            telaInicial = qs(".tela").innerHTML
            qs(".tela .cargo").textContent = sessaoAtual
        }
    } else if (sessaoAtual == "prefeito") {
        qs(".numeros-cargo").innerHTML = ""
        for (let i = 0; i < 2; i++) {
            let div = document.createElement("div")
            qs(".numeros-cargo").appendChild(div)
            qs(".tela .cargo").textContent = sessaoAtual
        }
    } else if (sessaoAtual == "confirmar") {
        let telaConfirma = qs(".models .confirmar-voto").cloneNode(true)
        telaConfirma.style.display = "flex"

        partidos.map((partido) => {
            if (vereadorVoto == partido.candidatos.vereador[0].numero) {
                telaConfirma.querySelector(".vereador img").setAttribute("src", `${partido.candidatos.vereador[0].imagem}`)
                telaConfirma.querySelector(".vereador .nome-candidato").textContent = `${partido.candidatos.vereador[0].nome}`
                telaConfirma.querySelector(".vereador .partido-candidato").textContent = `${partido.nome}`
            }
            if (prefeitoVoto == partido.numero) {
                telaConfirma.querySelector(".prefeito img").setAttribute("src", `${partido.candidatos.prefeito[0].imagem}`)
                telaConfirma.querySelector(".prefeito .nome-candidato").textContent = `${partido.candidatos.prefeito[0].nome}`
                telaConfirma.querySelector(".prefeito .partido-candidato").textContent = `${partido.nome}`
            }
        })

        qs(".tela").innerHTML = ""
        qs(".tela").appendChild(telaConfirma)
    } else {
        sessaoAtual = "vereador"
        qs(".tela").innerHTML = telaInicial
        qs(".tela").style.padding = "30px"
        console.log("Entrou no concluido!")
    }


    qsa(".numeros-cargo div").forEach(div => {
        qtdDigitos.push(div)
    })

}
sessao()

function reset() {
    numVoto = ""
    key = 0

    if (sessaoAtual == "vereador" || sessaoAtual == "prefeito") {
        qs("strong.partido").textContent = ""
        qs("strong.nome").textContent = ""
        qs(".foto").style.display = "none"

        qtdDigitos.map((div) => {
            div.textContent = ""
        })
    }

    sessao()
}

//* NUMEROS
qsa(".num").forEach((numero) => {
    numero.addEventListener("click", () => {
        qtdDigitos[key].textContent = numero.textContent
        key++

        numVoto += numero.textContent

        if (qtdDigitos.length == 5) { //VEREADOR
            partidos.map((partido) => {
                if (numVoto.slice(0, 2) == partido.numero) {
                    qs("strong.partido").textContent = partido.nome

                    if (numVoto.slice(2, 5) == partido.candidatos.vereador[0].numero) {
                        qs("strong.nome").textContent = partido.candidatos.vereador[0].nome
                        qs(".foto img").setAttribute("src", partido.candidatos.vereador[0].imagem)
                        qs(".foto").style.display = "grid"
                    }
                }
            })
        } else {
            partidos.map(partido => { //PREFEITO
                if (numVoto == partido.numero) {
                    qs("strong.partido").textContent = partido.nome

                    qs("strong.nome").textContent = partido.candidatos.prefeito[0].nome
                    qs(".foto img").setAttribute("src", partido.candidatos.prefeito[0].imagem)
                    qs(".foto").style.display = "grid"
                }
            })
        }
    })
})

//* BRANCO 
qs(".branco").addEventListener("click", () => {
    if (sessaoAtual == "confirmar" || sessaoAtual == "concluido") {
        return
    } else if (sessaoAtual == "vereador") {
        vereadorVoto = ""
        sessaoAtual = "prefeito"
        telaBranca()
    } else if (sessaoAtual == "prefeito") {
        prefeitoVoto = ""
        sessaoAtual = "concluido"
        telaVotoConfirmado()
    }
})

function telaBranca() {
    let telaBranca = qs(".models .voto-branco").cloneNode(true)

    let html = qs(".tela").innerHTML
    qs(".tela").style.padding = "0"
    qs(".tela").innerHTML = ""
    qs(".tela").appendChild(telaBranca)
    telaBranca.style.display = "flex"

    setTimeout(() => {
        qs(".tela").style.padding = "30px"
        qs(".tela").innerHTML = html

        reset()
        sessao()
    }, 1500)
}


//* CORRIGE
qs(".corrige").addEventListener("click", () => {
    if (sessaoAtual == "confirmar") {
        sessaoAtual = "vereador"
        qs(".tela").innerHTML = telaInicial
    }
    reset()
})

//* CONFIRMA
qs(".confirma").addEventListener("click", () => {
    let digitoVazio = false
    let numeroInvalido = true

    qtdDigitos.map((div) => {
        if (div.textContent == "") {
            digitoVazio = true
        }
    })

    partidos.map((partido) => {
        if (sessaoAtual == "vereador") {
            if (numVoto.slice(2, 5) == `${partido.candidatos.vereador[0].numero}`) {
                numeroInvalido = false
            }
        } else if (sessaoAtual == "prefeito") {
            if (numVoto.slice(0, 2) == `${partido.numero}`) {
                numeroInvalido = false
            }
        }
    })

    if (sessaoAtual == "confirmar") {

        sessaoAtual = "concluido"
        telaVotoConfirmado()
        console.log("entrou")

    } else {

        if (!digitoVazio && !numeroInvalido) {

            if (sessaoAtual == "vereador") {
                vereadorVoto = numVoto.slice(2, 5)
                sessaoAtual = "prefeito"
                telaVotoConfirmado()
            } else if (sessaoAtual == "prefeito") {
                prefeitoVoto = numVoto.slice(0, 2)
                sessaoAtual = "confirmar"
                telaVotoConfirmado()
            }

        } else {
            reset()
            alert("Digite um numero valido")
        }

    }
})


function telaVotoConfirmado() {
    let telaVerde = qs(".models .voto-confirmado").cloneNode(true)

    if (sessaoAtual == "concluido") {

        qs(".tela").innerHTML = ""
        qs(".tela").style.padding = "0"
        telaVerde.textContent = "Voto Concluido"
        telaVerde.style.display = "flex"
        qs(".tela").appendChild(telaVerde)

        setTimeout(() => {
            reset()
        }, 3000)

    } else {
        let html = qs(".tela").innerHTML
        qs(".tela").innerHTML = ""
        qs(".tela").style.padding = "0"
        telaVerde.style.display = "flex"
        qs(".tela").appendChild(telaVerde)

        setTimeout(() => {
            qs(".tela").style.padding = "30px"
            qs(".tela").innerHTML = html

            reset()
            sessao()
        }, 1500)
    }
}