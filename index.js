'use strict';

class Meal {
  constructor(price, taxRate, tipRate) {
    this.price = price;
    this.taxRate = taxRate / 100;
    this.tipRate = tipRate / 100;
  }

  subtotal() {
    return this.price + (this.taxRate * this.price);
  }

  tipTotal() {
    return this.price * this.tipRate;
  }

  total() {
    return this.subtotal() + this.tipTotal();
  }
}

class WaitStaffCalc {
  constructor() {
    this.store = [];
  }

  addMeal(data) {
    data = data.split('&').map(param => {
      const [__key, value] = param.split('=');
      return Number(value);
    });
    const meal = new Meal(...data);
    this.store.push(meal);
  }

  buildCustomerChargeHtml(meal) {
    if (!this.store.length) {
      return '';
    }
    return `
      <h3>Subtotal
        <span class='price'>$${this.format(meal.subtotal())}</span>
      </h3>
      
      <h3>Tip
        <span class='price'>$${this.format(meal.tipTotal())}</span>
      </h3>          

      <h3 class='total'>Total
        <span class='price'>$${this.format(meal.total())}</span>
      </h3>
    `;
  }
  
  tipTotal() {
    return this.store.reduce((total, meal) => {
      total += meal.tipTotal();
      return total;
    }, 0);
  }

  tipAverage() {
    return this.tipTotal() / this.store.length;
  }

  format(num){
    return Number(num).toFixed(2);
  }

  buildMyEarningsHtml() {
    if (!this.store.length) {
      return '';
    }
    return `
      <h3>Tip Total
        <span class='price'>$${this.format(this.tipTotal())}</span>
      </h3>
      
      <h3>Meal Count
        <span class='price'>${this.format(this.store.length)}</span>
      </h3>          

      <h3>Average Tip Per Meal
        <span class='price'>$${this.format(this.tipAverage())}</span>
      </h3>
    `;
  }

  render() {
    const lastMeal = this.store[this.store.length-1];
    const customerChargeHtml = this.buildCustomerChargeHtml(lastMeal);
    $('.js-customer-charges').html(customerChargeHtml);
    
    const myEarningsHtml = this.buildMyEarningsHtml();
    $('.js-my-earnings-info').html(myEarningsHtml);
  }

  reset() {
    this.store = [];
  }
}

const calculator = new WaitStaffCalc();

function handleNewMeal() {
  $('form').on('submit', function(event) {
    event.preventDefault();
    const formData = $(this).serialize();
    calculator.addMeal(formData);
    calculator.render();
    $(this)[0].reset();
  });
}

function handleReset() {
  $('.clear-calc').on('click', function() {
    calculator.reset();
    calculator.render();
  });
}

function main() {
  handleNewMeal();
  handleReset();
}

$(main);


