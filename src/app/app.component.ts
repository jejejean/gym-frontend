import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './core/loader/loader.component';
import { LoaderService } from '@core/loader/loader.service';
import { PrimeNG } from 'primeng/config';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
imports: [
    RouterOutlet,
    LoaderComponent,
    NgxSpinnerModule,
    CommonModule,
  ],  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loader = inject(LoaderService);
  primeng = inject(PrimeNG);
  toastr = inject(ToastrService);

  title = 'gym-front';

  ngOnInit(): void {
    this.primeng.ripple.set(true);

    this.primeng.zIndex = {
      modal: 1100, // dialog, sidebar
      overlay: 1000, // dropdown, overlaypanel
      menu: 1000, // overlay menus
      tooltip: 1100, // tooltip
    };

    this.primeng.setTranslation({
      dayNamesMin:["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    })

    this.primeng.setTranslation({
      startsWith: 'Empieza con',
      contains: 'Contiene',
      notContains: 'No contiene',
      endsWith: 'Termina con',
      equals: 'Igual a',
      notEquals: 'Distinto de',
      noFilter: 'Sin filtro',
      lt: 'Menor que',
      lte: 'Menor o igual que',
      gt: 'Mayor que',
      gte: 'Mayor o igual que',
      dateIs: 'Fecha igual a',
      dateIsNot: 'Fecha distinta de',
      dateBefore: 'Fecha antes de',
      dateAfter: 'Fecha después de',
      clear: 'Limpiar',
      apply: 'Aplicar',
      matchAll: 'Coincidir todos',
      matchAny: 'Coincidir cualquiera',
      addRule: 'Agregar regla',
      removeRule: 'Eliminar regla',
      accept: 'Sí',
      reject: 'No',
      choose: 'Elegir',
      upload: 'Subir',
      cancel: 'Cancelar',
    });
  }

  
}
