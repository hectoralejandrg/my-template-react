<template>
    <b-modal id="modalScheduleCarriers" title="Horarios de corte de retiros" modal-class="dialog-600" ok-variant="warning" ok-title="Crear" hide-footer ok-only no-close-on-esc no-close-on-backdrop >
        <div>
          <h5><b>Importante:</b></h5>
          <p>En caso que no se efectúe el retiro, es importante que durante la mañana del día siguiente nos informen a través del chat y además volver a agendar el retiro.</p>
          <p>Retiros para la mañana de Blue Express se deben de solicitar con fecha anterior al retiro. No se tomarán en cuenta si la solicitud fue creada el mismo día del retiro.</p>
          <p>Todos los retiros de Starken que tengan como origen en regiones distinto a RM se debe completar el archivo "Input" indicando la OT de cada envío a retirar y enviarlo al correo retiros@enviame.io o por medio del chat. En caso de enviarlo antes del horario de corte, el retiro queda agendado para el día siguiente, de lo contrario pasaría para el día subsiguiente. Descargar Input acá</p>
        </div>
        <table-render :schema="schema" :rows="rows"></table-render>
    </b-modal>
</template>
<script>

export default {
  name: 'modal-schedule-carriers',

  data () {
    return {
      schema: [
        { label: 'Carrier', key: 'carrier' },
        { label: 'Horario de corte', key: 'close_time'}
      ],
      rows: [
        {carrier: 'CHILEPRESS', close_time: '12:30'},
        {carrier: 'BOOSMAP', close_time: '16:30'},
        {carrier: '99MINUTOS', close_time: '18:30'}
      ]
    }
  }


}

</script>