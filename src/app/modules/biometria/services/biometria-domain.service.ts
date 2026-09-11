import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RespuestaBiometrica {
  success: boolean;
  es_la_misma_persona: boolean;
  distancia_matematica: number;
}

@Injectable() // 👈 Deja el decorador vacío para que respete tu módulo funcional
export class BiometriaDomainService {

//  REEMPLÁZALA EXACTAMENTE POR ESTA OTRA:
// private readonly API_URL = 'http://127.0.0';

 private API_URL = 'http://localhost:8000/api/v1/verificar-camara';

  constructor(private http: HttpClient) { }

  verificarRostro(blobCaptura: Blob): Observable<RespuestaBiometrica> {
    const formData = new FormData();

    // El parámetro coincide exactamente con tu backend de Python
    formData.append('captura_webcam', blobCaptura, 'webcam_capture.jpg');

    // 🚀 Lanza la petición HTTP POST real
    return this.http.post<RespuestaBiometrica>(this.API_URL, formData);
  }
}
