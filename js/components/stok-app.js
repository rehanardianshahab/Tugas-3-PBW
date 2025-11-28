Vue.component("stok-component", {
  data() {
    return {
      stok: [],
      keyword: "",
      filterKategori: "",
      filterUpbjj: "",
      tmpl: "",
      isReady: false,
      errorMsg: "",
      _timer: null
    };
  },

  watch: {
    keyword(newVal) {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        console.log("Keyword updated:", newVal);
      }, 300);
    },

    tmpl(val) {
      if (val) this.isReady = true;
    },

    stok(newVal) {
      console.log("Stok updated:", newVal.length);
    }
  },

  computed: {
    kategoriList() {
      const set = new Set(this.stok.map(item => item.kategori));
      return [...set];
    },

    upbjjList() {
      const set = new Set(this.stok.map(item => item.upbjj));
      return [...set];
    },

    filteredStok() {
      return this.stok.filter(item => {
        const matchKeyword =
          this.keyword === "" ||
          item.kode.toLowerCase().includes(this.keyword.toLowerCase()) ||
          item.judul.toLowerCase().includes(this.keyword.toLowerCase());

        const matchKategori =
          this.filterKategori === "" ||
          item.kategori === this.filterKategori;

        const matchUpbjj =
          this.filterUpbjj === "" ||
          item.upbjj === this.filterUpbjj;

        return matchKeyword && matchKategori && matchUpbjj;
      });
    },

    totalJenis() {
      return this.filteredStok.length;
    },

    totalQty() {
      return this.filteredStok.reduce((sum, item) => sum + item.qty, 0);
    }
  },

  template: `<div>Loading...</div>`,

  async created() {
    await this.loadStok();

    try {
      const res = await fetch("templates/stok-table.html");
      this.tmpl = await res.text();
    } catch (err) {
      this.errorMsg = "Gagal memuat template: " + err;
    }
  },

  render(createElement) {
    if (!this.isReady) return createElement("div", "Loading...");

    try {
      const compiled = Vue.compile(this.tmpl);
      this.$options.render = compiled.render;
      this.$options.staticRenderFns = compiled.staticRenderFns;

      return compiled.render.call(this, createElement);
    } catch (err) {
      return createElement("div", "Error render: " + String(err));
    }
  },

  methods: {
    async loadStok() {
      try {
        const response = await API.getStok();
        this.stok = response;
      } catch (err) {
        this.errorMsg = "Gagal mengambil data stok: " + err;
      }
    }
  }
});
