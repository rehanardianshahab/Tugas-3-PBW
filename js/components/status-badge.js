Vue.component("status-badge", {
    props: ["jumlah","maks"],
    name: 'status-badge',
    computed: {
      statusColor() {
        return this.jumlah > this.maks ? "status-success" : "status-danger";
      }
    },
  
    template: `
      <div :class="statusColor" :style="{
        padding: '8px 12px',
        display: 'inline-block',
        borderRadius: '6px',
        minWidth: '50px',
        marginBottom: '6px'
      }">
        {{ jumlah }}
      </div>
    `
});