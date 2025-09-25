document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const msg = document.getElementById("cep-msg");
    const rua = document.getElementById("logradouro");
    const bairro = document.getElementById("bairro");
    const cidade = document.getElementById("cidade");
    const uf = document.getElementById("uf");
    const numero = document.getElementById("numero");
    const listaProdutos = document.getElementById("lista-produtos");
    const subtotalSpan = document.getElementById("subtotal");
    const totalSpan = document.getElementById("total");

    // Pega os itens do carrinho
    const carrinho = (typeof Cart !== "undefined")
        ? Cart.getItems()
        : JSON.parse(localStorage.getItem("carrinho")) || [];

    // Atualiza a lista do resumo
    function atualizarResumo() {
        listaProdutos.innerHTML = "";
        let subtotal = 0;

        carrinho.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
            listaProdutos.appendChild(li);
            subtotal += item.preco * item.quantidade;
        });

        subtotalSpan.textContent = subtotal.toFixed(2);
        totalSpan.textContent = subtotal.toFixed(2);
    }

    atualizarResumo();

    // Formata o CEP enquanto digita
    cepInput.addEventListener("input", () => {
        let v = cepInput.value.replace(/\D/g, "");
        if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 8);
        cepInput.value = v;
    });

    // Busca o endereço pelo CEP
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) {
            showMsg("CEP inválido.");
            return;
        }

        try {
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!resp.ok) throw new Error("Erro de rede");

            const data = await resp.json();
            console.log("Resposta da API ViaCEP:", data); // 🔍 Depuração

            if (data.erro) {
                showMsg("CEP não encontrado. Preencha manualmente.");
                return;
            }

            rua.value = data.logradouro || "";
            bairro.value = data.bairro || "";
            cidade.value = data.localidade || "";
            uf.value = data.uf || "";

            msg.textContent = "";
            numero.focus();

        } catch (e) {
            console.error("Erro ao buscar CEP:", e);
            showMsg("Erro ao buscar CEP. Tente novamente.");
        }
    });

    // Função de mensagens
    function showMsg(texto) {
        msg.textContent = texto;
    }

    // Finalizar compra
    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }

        alert(`Compra finalizada!\nTotal: R$ ${totalSpan.textContent}`);

        if (typeof Cart !== "undefined") Cart.clear();
        else localStorage.removeItem("carrinho");

        window.location.href = "index.html";
    });
});
