var app = new Vue({
  el: '#app',
  data: {
    logs: [],
    filteredLevel: null
  },
  methods: {
    stack: function (text) {
      if (!text) {
        return "";
      }
      return text.replace(/\n/, "<br>").replace(/\t/, "&nbsp;&nbsp;")
    },
    upload: function (ev) {
      const files = ev.target.files;
      if (files.length <= 0) {
        return;
      }

      const file = files.item(0)
      if (file.name !== "esp_idf_vsc_ext.log") {
        alert("Only esp_idf_vsc_ext.log file supported");
        return;
      }

      const fr = new FileReader();

      fr.onload = e => {
        try {
          const content = e.target.result;
          content.split("\n").forEach(line => {
            if (!line || line === "") {
              return;
            }
            this.logs.push(JSON.parse(line))
          });
        } catch (error) {
          alert("Failed to parse JSON")
        }
      }

      fr.readAsText(file)
    }
  },
  computed: {
    cLogs: function () {
      if (!this.filteredLevel || this.filteredLevel === "") {
        return this.logs
      }
      return this.logs.filter((l) => (l.l === this.filteredLevel))
    }
  }
})