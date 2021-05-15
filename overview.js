var tableView = document.getElementById('tableview');
var cards = document.getElementById('cards');

files.forEach(file => {


  var card=document.createElement('div');
  card.setAttribute('class','card');


  var hyperlink = document.createElement('a');
  hyperlink.setAttribute('href','map.html?route=' + file+'.gpx')
  var content=document.createElement('div');
  content.setAttribute('class','card-content');
  var span=document.createElement('span');
  span.setAttribute('class','card-title activator grey-text text-darken-4 flow-text');
  span.textContent=toTitleCase(file.replace(/-/g, " ")).replace('Ns',"NS");

  var icon=document.createElement('i');
  icon.setAttribute('class','material-icons right');
  icon.textContent = 'arrow_forward';


  span.appendChild(icon);
  content.appendChild(span);
  hyperlink.appendChild(content);
  card.appendChild(hyperlink);

  cards.appendChild(card)

});

function toTitleCase(str) {
  return str.replace(
      /\w\S*/g,
      function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
  );
}


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
  });
});

// <div class="card">
//   <div class="card-content">
//     <span class="card-title activator grey-text text-darken-4 flow-text">
//       NS Muiderslot
//       <i class="material-icons right">arrow_forward</i></span>
//     </div>
// </div>
