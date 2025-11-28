Vue.component("order-component", {
  props: {
    initialItems: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      isReady: false,
      tmpl: "",
      items: [],
      query: "",
      newItem: { name: "", qty: 1, price: 0 },
      editIndex: null,
      editBuffer: {},
      stokList: []
    };
  },

  template: "<div>Loading...</div>",

  created() {
    this.items = (this.initialItems || []).map(i => Object.assign({}, i));

    fetch("templates/order-form.html")
      .then(res => {
        if (!res.ok) throw new Error("Gagal memuat template: " + res.status);
        return res.text();
      })
      .then(html => {
        this.tmpl = html;
        this.isReady = true;
      })
      .catch(err => {
        console.error(err);
        this.tmpl = "<div style='color:red'>Gagal memuat template.</div>";
        this.isReady = true;
      });

    fetch("./data/dataBahanAjar.json")
      .then(res => res.json())
      .then(data => {
        this.stokList = data.stok || [];
      })
      .catch(err => console.error("Gagal load stok:", err));
  },

  methods: {
    formatCurrency(v) {
      if (typeof v !== "number") v = Number(v) || 0;
      return "Rp " + v.toLocaleString("id-ID");
    },

    resetFilter() {
      this.query = "";
    },

    cekStok(nama, qty) {
      const barang = this.stokList.find(
        s => (s.judul || "").toLowerCase() === nama.toLowerCase()
      );

      if (!barang) {
        return { ok: false, msg: "Barang tidak ditemukan di daftar stok." };
      }

      if (qty > barang.qty) {
        return { ok: false, msg: `Stok tidak cukup. Stok tersedia: ${barang.qty}` };
      }

      return { ok: true };
    },

    addItem() {
      if (!this.newItem.name || this.newItem.qty <= 0) {
        alert("Nama barang dan qty harus diisi (qty > 0).");
        return;
      }

      const cek = this.cekStok(this.newItem.name, this.newItem.qty);
      if (!cek.ok) {
        alert(cek.msg);
        return;
      }

      const barang = this.stokList.find(
        s => (s.judul || "").toLowerCase() === this.newItem.name.toLowerCase()
      );
      const harga = barang?.harga || 0;

      const id = "i" + Date.now();
      const item = {
        id,
        name: String(this.newItem.name),
        qty: Number(this.newItem.qty),
        price: harga
      };

      this.items.push(item);

      this.clearNew();
      this.emitUpdate();
    },

    clearNew() {
      this.newItem = { name: "", qty: 1, price: 0 };
    },

    removeItem(item) {
      if (!confirm("Hapus item '" + item.name + "' ?")) return;
      this.items = this.items.filter(i => i.id !== item.id);
      if (this.editIndex === item.id) this.cancelEdit();
      this.emitUpdate();
    },

    startEdit(item) {
      this.editIndex = item.id;
      this.editBuffer = { name: item.name, qty: item.qty, price: item.price };
    },

    cancelEdit() {
      this.editIndex = null;
      this.editBuffer = {};
    },

    saveEdit(item) {
      if (!this.editBuffer.name || this.editBuffer.qty <= 0) {
        alert("Nama dan qty wajib diisi (qty > 0).");
        return;
      }

      const cek = this.cekStok(this.editBuffer.name, this.editBuffer.qty);
      if (!cek.ok) {
        alert(cek.msg);
        return;
      }

      const idx = this.items.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        this.items.splice(idx, 1, {
          id: item.id,
          name: String(this.editBuffer.name),
          qty: Number(this.editBuffer.qty),
          price: Number(this.editBuffer.price)
        });
      }

      this.cancelEdit();
      this.emitUpdate();
    },

    emitUpdate() {
      const cloned = this.items.map(i => Object.assign({}, i));
      this.$emit("items-updated", cloned);
    }
  },

  computed: {
    filteredItems() {
      const q = (this.query || "").toLowerCase().trim();
      if (!q) return this.items;
      return this.items.filter(i => (i.name || "").toLowerCase().includes(q));
    }
  },

  render(createElement) {
    if (!this.isReady) {
      return createElement("div", "Loading...");
    }

    try {
      const compiled = Vue.compile(this.tmpl);
      this.$options.render = compiled.render;
      this.$options.staticRenderFns = compiled.staticRenderFns;
      return compiled.render.call(this, createElement);
    } catch (err) {
      return createElement("div", "Error render: " + String(err));
    }
  }
});
