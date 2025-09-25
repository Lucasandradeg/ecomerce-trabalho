(function(global){
    'use strict';

    const STORAGE_KEY = 'carrinho';

    const fmtBRL = (n)=> 'R$ ' + Number(n||0).toFixed(2);

    function read(){
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
        catch { return []; }
    }
    function write(items){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function calc(items){
        let subtotal = 0, count = 0;
        for(const it of items){
            const q = Number(it.quantidade||0);
            const p = Number(it.preco||0);
            subtotal += p * q;
            count += q;
        }
        return { subtotal, total: subtotal, count };
    }

    function updateBadge(count){

        const badge = document.getElementById('cart-badge');
        if(badge) badge.textContent = String(count);
    }

    function normalizeItem(item){

        return {
            id: item.id,
            nome: item.nome ?? item.title ?? 'Produto',
            preco: Number(item.preco ?? item.price ?? 0),
            quantidade: Math.max(1, Number(item.quantidade ?? 1)),
            imagem: item.imagem ?? item.image ?? ''
        };
    }

    const Cart = {
        add(item){
            const it = normalizeItem(item);
            const items = read();
            const idx = items.findIndex(x => String(x.id) === String(it.id));
            if(idx >= 0){
                items[idx].quantidade = Math.max(1, Number(items[idx].quantidade||1) + it.quantidade);
            }else{
                items.push(it);
            }
            write(items);
            const s = calc(items);
            updateBadge(s.count);
            Cart._emitUpdate(items, s);
        },

        remove(id){
            let items = read();
            items = items.filter(x => String(x.id) !== String(id));
            write(items);
            const s = calc(items);
            updateBadge(s.count);
            Cart._emitUpdate(items, s);
        },

        updateQty(id, qty){
            const q = Math.max(1, Number(qty||1));
            const items = read();
            const idx = items.findIndex(x => String(x.id) === String(id));
            if(idx < 0) return;
            items[idx].quantidade = q;
            write(items);
            const s = calc(items);
            updateBadge(s.count);
            Cart._emitUpdate(items, s);
        },

        getState(){
            const items = read();
            const s = calc(items);
            return { items, ...s };
        },

        clear(){
            write([]);
            updateBadge(0);
            Cart._emitUpdate([], {subtotal:0,total:0,count:0});
        },


        _emitUpdate(items, summary){
            try{
                global.AppBus = global.AppBus || new EventTarget();
                const ev = new CustomEvent('carrinho:atualizado', { detail: { items, ...summary } });
                global.AppBus.dispatchEvent(ev);
            }catch(e){}
        }
    };


    global.Cart = Cart;

})(window);