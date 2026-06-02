import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact';
import { Contact, NouveauContact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-manager',
  imports: [],
  templateUrl: './contact-manager.html',
  styleUrl: './contact-manager.scss',
})
export class ContactManager implements OnInit {
  private service = inject(ContactService);

  contacts = signal<Contact[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  enEdition = signal<Contact | null>(null);

  // 1) RECHERCHE — un signal pour le texte, un computed pour la liste filtree
  recherche = signal('');
  contactsFiltres = computed(() => {
    const q = this.recherche().trim().toLowerCase();
    if (!q) return this.contacts();
    return this.contacts().filter(
      c =>
        c.nom.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.tel.toLowerCase().includes(q),
    );
  });

  // 2) VALIDATION — message d'erreur du formulaire + regex email
  formError = signal<string | null>(null);
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.loading.set(true);
    this.error.set(null);
    this.service.getAll().subscribe({
      next: data => {
        this.contacts.set(data);
        this.loading.set(false);
      },
      // 3) catchError : le service fournit deja le message, on l'affiche
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  // renvoie true si l'envoi a ete accepte (-> le template vide alors les champs)
  enregistrer(form: { nom: string; email: string; tel: string }): boolean {
    // 2) VALIDATION : on bloque si l'email est invalide
    if (!this.emailRegex.test(form.email)) {
      this.formError.set('Email invalide — exemple attendu : nom@domaine.com');
      return false;
    }
    this.formError.set(null);

    const enEdition = this.enEdition();

    if (enEdition) {
      // ---- UPDATE (PATCH) ----
      const maj: Contact = { ...enEdition, ...form };
      this.service.update(maj).subscribe({
        next: c => {
          this.contacts.update(list => list.map(x => (x.id === c.id ? c : x)));
          this.annulerEdition();
        },
        error: (err: Error) => this.error.set(err.message),
      });
    } else {
      // ---- CREATE (POST) ----
      this.service.create(form as NouveauContact).subscribe({
        next: c => this.contacts.update(list => [...list, c]),
        error: (err: Error) => this.error.set(err.message),
      });
    }
    return true;
  }

  editer(contact: Contact) {
    this.enEdition.set(contact);
  }

  annulerEdition() {
    this.enEdition.set(null);
    this.formError.set(null);
  }

  // 4) OPTIMISTIC UI : on retire le contact tout de suite, on restaure si l'API echoue
  supprimer(contact: Contact) {
    if (!confirm(`Supprimer ${contact.nom} ?`)) return;

    const sauvegarde = this.contacts();
    this.contacts.update(list => list.filter(c => c.id !== contact.id));

    this.service.delete(contact.id).subscribe({
      error: () => {
        this.contacts.set(sauvegarde); // rollback
        this.error.set('Echec de la suppression — contact restaure');
      },
    });
  }
}
