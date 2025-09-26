document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const msg = document.getElementById("cep-msg");
    const ruaInput = document.getElementById("logradouro");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const numeroInput = document.getElementById("numero");
    const listaProdutos = document.getElementById("lista-produtos");
    const subtotalSpan = document.getElementById("subtotal");
    const totalSpan = document.getElementById("total");
    const form = document.getElementById("checkout-form");

    function atualizarResumo() {
        if (typeof Cart === 'undefined') {
            console.error("O objeto Cart (carrinho.js) não foi encontrado.");
            listaProdutos.innerHTML = "<li>Erro ao carregar o carrinho.</li>";
            return;
        }

        const carrinhoItens = Cart.getItems();
        listaProdutos.innerHTML = "";
        
        if (carrinhoItens.length === 0) {
            listaProdutos.innerHTML = "<li>Seu carrinho está vazio.</li>";
        } else {
            carrinhoItens.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade}</span>
                    <button class="btn-remover" data-id="${item.id}">Remover</button>
                `;
                listaProdutos.appendChild(li);
            });
        }

        const total = Cart.getTotal();
        subtotalSpan.textContent = total.toFixed(2);
        totalSpan.textContent = total.toFixed(2);
    }

    listaProdutos.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('btn-remover')) {
            const idParaRemover = Number(event.target.dataset.id);
            Cart.remove(idParaRemover);
            atualizarResumo(); 
        }
    });

    cepInput.addEventListener("input", () => {
        let v = cepInput.value.replace(/\D/g, "");
        if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5, 8);
        cepInput.value = v;
    });

    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length !== 8) {
            if (cep.length > 0) showMsg("CEP inválido.");
            return;
        }
        showMsg("Buscando CEP...");
        try {
            const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            if (!resp.ok) throw new Error("Erro de rede");
            const data = await resp.json();
            if (data.erro) {
                showMsg("CEP não encontrado. Preencha manualmente.");
                return;
            }
            ruaInput.value = data.logradouro || "";
            bairroInput.value = data.bairro || "";
            cidadeInput.value = data.localidade || "";
            ufInput.value = data.uf || "";
            msg.textContent = "";
            numeroInput.focus();
        } catch (e) {
            console.error("Erro ao buscar CEP:", e);
            showMsg("Erro ao buscar CEP. Tente novamente.");
        }
    });

    function showMsg(texto) {
        msg.textContent = texto;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (Cart.getItems().length === 0) {
            alert("O carrinho está vazio!");
            return;
        }
        alert(`Compra finalizada!\nTotal: R$ ${totalSpan.textContent}`);
        Cart.clear();
        window.location.href = "index.html";
    });

    atualizarResumo();
});