function drawCard(data) {
  //react js 로 작업이 필요
  //cardinit
  console.log(data)
  let list = data.data
  let statement = '';
  for (var i = 0; i < list.length; i++) {
    statement += '<div class="ui sizer vertical segment">'
    statement += '<div class="ui medium header">' + list[i].COMPANY_NAME + '</div>'
    statement += '<p>'    
    statement += '<div class="ui five column doubling stackable grid container">'
    for (var j = 0; j < list[i].PLACE.length; j++) {
      for (var k = 0; k < list[i].PLACE[j].SENSOR.length; k++) {
        statement += '<div class="column">'
        statement += '<div class="ui card" data-source="' + list[i].PLACE[j].SENSOR[k]['SENSOR_TOKEN'] + '">'
        statement += '<div class="content">'
        statement += '<div class="header">[' + list[i].PLACE[j]['PLACE_NAME'] + ']' + list[i].PLACE[j].SENSOR[k]['SENSOR_NAME'] + '</div>'
        statement += '</div>'
        statement += '<div class="tempContent content">'
        statement += '<div class="ui small feed">'
        statement += '<div class="event temp">'
        statement += '<div class="content">'
        statement += '<div class="summary tempSummary">'
        statement += ''
        statement += '</div>'
        statement += '</div>'
        statement += '</div>'
        statement += '</div>'
        statement += '</div>'
        statement += '<div class="humiContent content">'
        statement += '<div class="ui small feed">'
        statement += '<div class="event temp">'
        statement += '<div class="content">'
        statement += '<div class="summary humiSummary">'
        statement += ''
        statement += '</div>'
        statement += '</div>'
        statement += '</div>'
        statement += '</div>'
        statement += '</div>'
        statement += '<a href="/detail/' + list[i].PLACE[j].SENSOR[k]['SENSOR_IDX'] + '">'
        statement += '<div class="ui bottom attached button blue">'
        statement += '<i class="eye icon"></i>'
        statement += '센서 정보'
        statement += '</div>'
        statement += '</a>'
        statement += '</div>'
        statement += '</div>'
      } 
    }
    statement += '</p>'
    statement += '</div>'
  }
  return statement
}
