M.Tabs.init(document.querySelectorAll('.tabs'))

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);
});

// форматирование цены
const toCorrency = price => {
    return new Intl.NumberFormat('ru-Ru', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}
document.querySelectorAll('.price_strat').forEach(node => {
    node.textContent = toCorrency(node.textContent)
})


// параллакс эффект 
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    M.Parallax.init(elems, 1920);
  });


// date
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  });
  const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})
// dinamic view
const card = document.querySelector('#card')
if (card) {
    card.addEventListener('click', event => {
      console.log(event)
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf 
            fetch('/card/remove/' + id, {
              method: 'delete',
              credentials: "same-origin",
            
              headers: {
                  'x-xsrf-token': csrf,
                  "Content-Type": "application/json"
              },
          }).then(res => res.json())
            .then(cart => {
              console.log('cart ', cart)
                if (cart.strats.length) {
                  const html = cart.strats.map(c => {
                      return `<tr><td>${c.title_strat}</td><td>${c.count}</td><td><button class="btn btn-small js-remove" data-id="${c._id}" data-csrf="${csrf}">Удалить</button></td></tr>`
                  }).join('')
                  console.log('html',html)
                  document.querySelector('tbody').innerHTML = html
                  document.querySelector('.price_strat').textContent = toCorrency(card.price_strat)
                } else {
                  document.querySelector('#card').innerHTML = '<p> Basket is empty </p>'
                }
            })
            
        }
    })
}


// const del_from_prof = document.querySelector('#into_remove')
// if (del_from_prof) {
//   del_from_prof.addEventListener('click', event => {
//       console.log('sdsds')
//         if (event.target.classList.contains('js-remove')) {
//             const id = event.target.dataset.id
//             const csrf = event.target.dataset.csrf 
//             fetch('/blog/remove/' + id, {
//               method: 'delete',
//               credentials: "same-origin",
            
//               headers: {
//                   'x-xsrf-token': csrf,
//                   "Content-Type": "application/json"
//               },
//           }).then(res => res.json())
//             .then(cart => {
//                 if (cart.items.length) {
//                   const html = cart.items.map(c => {
//                       return `<li><a class="waves-effect" href="#!">${c.title_strat}</a></li><div class="strat_container"><div class="into_one">{{#if @root.isAuth}}<a href="/blog/strat/${c._id}/edit?allow=true">Редактировать</a>{{/if}}</div><div class="into_two"><button class="btn btn-small js-remove" data-id="${c._id}" data-csrf="${csrf}">Удалить</button></div></div>`
//                   }).join('')
//                   console.log(html)
//                   document.getElementById('body').innerHTML = html
//                 } else {
//                   document.getElementById('strats_profile').innerHTML = '<p> Стратегий нет </p>'
//                 }
//             })
            
//         }
//     })
// }


// калькулятор
const check_kons = document.getElementById('check_kons')
const check_risk = document.getElementById('check_risk')

document.getElementById('check_risk').addEventListener('click', function() {
  if (document.getElementById('check_kons').disabled != true) {
    document.getElementById('check_kons').disabled = true
    if(document.getElementById('check_kons').classList.contains('active')){
      document.getElementById('check_kons').classList.remove('active')
    }
    if(!document.getElementById('check_risk').classList.contains('active')) {
      document.getElementById('check_risk').classList.add('active')
    } 
  } else {
    document.getElementById('check_kons').disabled = false
    if(document.getElementById('check_risk').classList.contains('active')) {
      document.getElementById('check_risk').classList.remove('active')
    } 
  }
})

document.getElementById('check_kons').addEventListener('click', function() {
  if (document.getElementById('check_risk').disabled != true) {
    document.getElementById('check_risk').disabled = true
    if(document.getElementById('check_risk').classList.contains('active')){
      document.getElementById('check_risk').classList.remove('active')
    }
    if(!document.getElementById('check_kons').classList.contains('active')) {
      document.getElementById('check_kons').classList.add('active')
    } 
  } else {
    document.getElementById('check_risk').disabled = false
    if(document.getElementById('check_kons').classList.contains('active')) {
      document.getElementById('check_kons').classList.remove('active')
    } 
  }
})


document.querySelector('.result_button').addEventListener('click', function() {
  
  const Ak = 6
  const Bk = 2
  const Ap = 4
  const Bp = 1

  const risk = document.getElementById('risk').value
  const profit  = document.getElementById('profit').value
  if ( document.getElementById('check_risk').classList.contains('active')) {
    let result = 0
    result = Ap*(profit/risk) - Bp/risk
    console.log(Ap)
    document.getElementById('result_value').textContent = result
  } 
  
  if ( document.getElementById('check_kons').classList.contains('active')) {
    let result = 0
    result = Ak*(profit/risk) - Bk/risk
    console.log(result)
    document.getElementById('result_value').textContent = result
  } 
})


