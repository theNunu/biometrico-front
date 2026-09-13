// import { Component } from '@angular/core';
import { Component, ElementRef, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BiometriaDomainService, RespuestaBiometrica } from '../../services/biometria-domain.service';
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

  private mediaStream: MediaStream | null = null;

  private biometriaSub?: Subscription;

  // Variable para guardar la respuesta y mostrarla en el HTML
  resultadoBackend: RespuestaBiometrica | null = null;

  constructor(private biometriaService: BiometriaDomainService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.activarCamaraWeb();
  }
  // Activar la cámara
  public async activarCamara(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.nativeElement.srcObject = this.mediaStream;
    } catch (error) {
      console.error('No se pudo acceder a la cámara:', error);
    }
  }


  // Desactivar la cámara
  public desactivarCamara(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.mediaStream = null;
    }
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



      this.resultadoBackend = null;

      // 3. Consumir el Servicio de Dominio
      this.biometriaSub = this.biometriaService.verificarRostro(blob).subscribe({
        next: (resultado) => {



          this.cargando = false;
          // Guardamos el JSON en nuestra variable para que el HTML lo vea
          this.resultadoBackend = resultado;

          if (resultado.es_la_misma_persona) {
            this.estadoMensaje = `✅ ¡Acceso Concedido! (Confianza: ${resultado.distancia_matematica.toFixed(4)})`;
          } else {
            this.estadoMensaje = `❌ Acceso Denegado. El rostro no coincide con el registro.`;
          }

          // 🚀 3. ¡LA MAGIA! Le avisa a Angular que redibuje el HTML inmediatamente
          this.cdr.detectChanges();
        },

        error: (err) => {
          this.cargando = false;
          this.estadoMensaje = '🚨 Error de conexión o procesamiento en el servidor.';
          console.error(err);
        }
      });
    }, 'image/jpeg', 0.90);

    // Forzar renderizado también en caso de error
    this.cdr.detectChanges();
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
