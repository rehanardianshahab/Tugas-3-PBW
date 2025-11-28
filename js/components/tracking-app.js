Vue.component("tracking-component", {
  props: ["initialResi"],

  data() {
    return {
      isReady: false,
      tmpl: "",
      resi: this.initialResi || "",
      result: null,
      loadingSearch: false,
      errorMsg: "",
      _timer: null
    };
  },

  watch: {
    initialResi(newVal) {
      this.resi = newVal;
      if (newVal) this.search();
    },

    resi(value) {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        if (value.trim() !== "") {
          this.search();
        }
      }, 500);
    }
  },

  methods: {
    async search() {
      if (!this.resi.trim()) {
        this.errorMsg = "Resi tidak boleh kosong.";
        this.result = null;
        return;
      }

      this.loadingSearch = true;
      this.errorMsg = "";

      try {
        const trackingData = await API.getTracking(this.resi);

        if (!trackingData) {
          this.errorMsg = `Data tidak ditemukan untuk resi: <strong>${this.resi}</strong>`;
        }

        this.result = trackingData;
      } catch (err) {
        this.errorMsg = "Gagal mengambil data: " + err;
      }

      this.loadingSearch = false;
    }
  },

  template: `<div>Loading...</div>`,

  async created() {
    const res = await fetch("templates/do-tracking.html");
    this.tmpl = await res.text();
    this.isReady = true;
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
  }
});
