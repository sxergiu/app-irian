import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';

interface GroupDto {
  name: string;
  numberOfPeople: number;
}

@Component({
  selector: 'app-named-groups',
  templateUrl: './named-groups.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./named-groups.component.scss']
})

export class NamedGroupsComponent  {
  selectedFile: File | null = null;
  uploadResponse: string = '';
  groups: GroupDto[] = [];

  constructor(private http: HttpClient) {
    this.fetchGroups();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/api/group/upload', formData, { responseType: 'text' })
      .subscribe({
        next: response => {
          this.uploadResponse = `✅ Success: ${response}`;
          this.fetchGroups(); // Fetch after successful upload
        },
        error: (error: HttpErrorResponse) => {
          this.uploadResponse = `❌ Error: ${error.error}`;
        }
      });
  }

  fetchGroups(): void {
    this.http.get<GroupDto[]>('http://localhost:8080/api/group')
      .subscribe({
        next: data => {
          this.groups = data;
        },
        error: error => {
          this.uploadResponse = `❌ Failed to fetch groups`;
        }
      });
  }
}
