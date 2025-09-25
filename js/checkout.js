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
    
    // Sugestão: Usar o objeto Cart para consistência
    const carrinho = (typeof Cart !== 'undefined') ? Cart.getItems() : JSON.parse(localStorage.getItem("carrinho")) || [];

    function atualizarResumo() {
        listaProdutos.innerHTML = "";
        let subtotal = 0;

        carrinho.forEach(item => {
            const li = document.createElement("li");
            // ERRO 1 CORRIGIDO
            li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}`;
            listaProdutos.appendChild(li);
            subtotal += item.preco * item.quantidade;
        });

        subtotalSpan.textContent = subtotal.toFixed(2);
        totalSpan.textContent = (subtotal).toFixed(2);
    }

    atualizarResumo();

    cepInput.addEventListener("input", () => {
        let v = cepInput.value.replace(/\D/g, "");
        if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 8);
        cepInput.value = v;
    });

    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) {
            showMsg("CEP inválido.");
            return;
        }

        try {
            // ERRO 2 CORRIGIDO
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!resp.ok) throw new Error("Erro de rede");

            const data = await resp.json();
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
            showMsg("CEP Inexistente.");
        }
    });

    function showMsg(texto) {
        msg.textContent = texto;
    }

    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            alert("O carrinho está vazio!");
            return;
        }
        
        // ERRO 3 CORRIGIDO
        alert(`Compra finalizada!\nTotal: R$ ${totalSpan.textContent}`);
        
        // Sugestão: Usar o objeto Cart para consistência
        if(typeof Cart !== 'undefined') Cart.clear();
        else localStorage.removeItem("carrinho");

        window.location.href = "index.html";
    });
});