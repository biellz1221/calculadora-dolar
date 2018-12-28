<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png"><br>
    <label for="cotacao"><b>Cotação do Dólar</b></label><br>
    <money name="cotacao" v-model="cotacaoCompraFull" v-bind="money" @input="calcDolar"></money><br><br>
    <label for="valor"><b>Valor em Dolares</b></label><br>
    <money name="valor" v-model="valorDolar" v-bind="money" @input="calcDolar"></money><br><br>
    <label for="spread"><b>Spread do Cartão (%)</b></label><br>
    <money name="spread" v-model="spreadCartao" v-bind="money" @input="calcDolar"></money><br><br>
    <label for="iof"><b>IOF (%)</b></label><br>
    <money name="iof" v-model="iofTax" v-bind="money" @input="calcDolar"></money><br><br>
    <!-- <button @click="calcDolar">Calcular!</button><br><br> -->
    
    Cotação Dólar: R$ {{cotacaoCompra}}<br>
    Dia da Cotação: {{dia}}/{{mes}}/{{ano}}<br>
    <small class="fonte">Fonte: <a href="https://dadosabertos.bcb.gov.br/dataset/dolar-americano-usd-todos-os-boletins-diarios/resource/ae69aa94-4194-45a6-8bae-12904af7e176" target="_blank" rel="noopener">API do Banco Central do Brasil</a></small><br><br>
    <b>Valor Final: R$ {{valorReais}}</b>
  </div>
</template>

<script>
import axios from 'axios';
import {Money} from 'v-money';
import _ from 'lodash'
export default {
  name: 'app',
  data(){
    return {
      iofTax: '6.38',
      spreadCartao: '4.00',
      dia: null,
      mes: null,
      ano: null,
      cotacaoCompra: '',
      cotacaoCompraFull: '',
      valorReais: '',
      valorDolar: '',
      money: {
        decimal: '.',
        thousands: '',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      },
    }
  },
  components: {Money},
  methods: {
    getToday() {
      let dt = new Date();
      this.dia = dt.getDate();
      this.mes = dt.getMonth()+1;
      this.ano = dt.getFullYear();
      this.sanitizeDiaMes(this.mes, 'mm');
      this.sanitizeDiaMes(this.dia, 'dd');
      return `${this.mes}-${this.dia}-${this.ano}`
    },
    sanitizeDiaMes(valor, mesDia) {
      if (mesDia == 'mm' && this.mes<10) {
          this.mes = '0'+this.mes
      }
      if (mesDia == 'dd' && this.dia<10) {
          this.dia = '0'+this.dia
      }
    },
    getValorDolar(dia) {
      axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dia}'&$top=100&$format=json`)
      .then((res)=>{
        if (res.data.value.length > 0 ) {
          this.cotacaoCompraFull = res.data.value[0].cotacaoCompra;
          this.cotacaoCompra = parseFloat(res.data.value[0].cotacaoCompra).toFixed(2);
        } else {
          this.dia = this.dia-1
          if (this.dia == 0) {
            this.mes = this.mes-1;
            if (this.mes == 1 && this.dia == 1) {
              this.getValorDolar(`12-31-${this.ano-1}`)
            } else {
              switch(parseInt(this.mes)) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                  this.dia = 31;
                  break;
                case 4:
                case 6:
                case 9:
                case 11:
                  this.dia = 30;
                  break;
                case 2:
                  this.dia = 26;
                  break;
              }
              this.sanitizeDiaMes(this.mes, 'mm');
              this.sanitizeDiaMes(this.dia, 'dd');
              this.getValorDolar(`${this.mes}-${this.dia}-${this.ano}`)
            }
          } else {
            this.sanitizeDiaMes(this.mes, 'mm');
            this.sanitizeDiaMes(this.dia, 'dd');
            this.getValorDolar(`${this.mes}-${this.dia}-${this.ano}`)
          }
        }
      })
    },
    calcDolar: _.debounce(function() {
      if(this.valorDolar) {
        let dolar = parseFloat(this.valorDolar).toFixed(2);
        let spread = parseFloat(this.spreadCartao/100);
        let iof = parseFloat(this.iofTax/100);
        let convDireta = dolar*this.cotacaoCompraFull;
        this.valorReais = parseFloat(convDireta+(convDireta*spread)+(convDireta*iof)).toFixed(2);
        // console.log("IOF "+iof);
        // console.log("Spread "+spread)
      } else {
        this.valorDolar = '0.00';
        this.valorReais = '0.00'
      }
    }, 300)
  },
  created() {
    this.getValorDolar(this.getToday());
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.fonte {
  font-style: italic;
  font-size: .55em;
}
</style>
