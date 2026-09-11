// import { Component } from '@angular/core';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BiometriaDomainService } from '../../services/biometria-domain.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-validator-facial',
  standalone: false,
  templateUrl: './validator-facial.component.html',
  styleUrl: './validator-facial.component.css'
})
export class ValidatorFacialComponent {

    @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;
  estadoMensaje: string = 'Iniciando cámara...';
  cargando: boolean = false;
  
  private biometriaSub?: Subscription;

  constructor(private biometriaService: BiometriaDomainService) {}

  ngOnInit(): void {
    this.activarCamaraWeb();
  }

  activarCamaraWeb(): void {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then((mediaStream) => {
        this.stream = mediaStream;
        this.videoElement.nativeElement.srcObject = mediaStream;
        this.estadoMensaje = '📷 Cámara lista. Coloca tu rostro frente a la pantalla.';
      })
      .catch((error) => {
        this.estadoMensaje = '❌ No se pudo acceder a la cámara web. Verifica los permisos.';
        console.error('Error webcam:', error);
      });
  }

  ejecutarEscaneo(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      this.estadoMensaje = '⚠️ La cámara aún no está lista.';
      return;
    }

    this.cargando = true;
    this.estadoMensaje = '⏳ Analizando facciones con Inteligencia Artificial...';

    // 1. Dibujar el cuadro actual en el canvas oculto
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. Extraer el blob de imagen en formato JPEG limpio
    canvas.toBlob((blob) => {
      if (!blob) {
        this.estadoMensaje = '❌ Error al capturar la imagen del canvas.';
        this.cargando = false;
        return;
      }

      // 3. Consumir el Servicio de Dominio
      this.biometriaSub = this.biometriaService.verificarRostro(blob).subscribe({
        next: (resultado) => {
          this.cargando = false;
          if (resultado.es_la_misma_persona) {
            this.estadoMensaje = `✅ ¡Acceso Concedido! (Confianza: ${resultado.distancia_matematica.toFixed(4)})`;
          } else {
            this.estadoMensaje = `❌ Acceso Denegado. El rostro no coincide con el registro.`;
          }
        },
        error: (err) => {
          this.cargando = false;
          this.estadoMensaje = '🚨 Error de conexión o procesamiento en el servidor.';
          console.error(err);
        }
      });
    }, 'image/jpeg', 0.90);
  }

  ngOnDestroy(): void {
    // Limpieza obligatoria en arquitectura modular para evitar fugas de memoria
    if (this.biometriaSub) {
      this.biometriaSub.unsubscribe();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

}
