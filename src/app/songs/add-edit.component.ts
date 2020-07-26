import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from 'src/app/_services';
//import { Console } from 'console';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.accountService.getSongs().subscribe(res => {
            console.log(res);

        })


        this.form = this.formBuilder.group({
            'SongName': this.formBuilder.control('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]),
            'SongUrl': this.formBuilder.control('', [Validators.required]),
            'Artist': this.formBuilder.control('', [Validators.required]),
            'Album': this.formBuilder.control('', [Validators.required]),
            'CoverImage': this.formBuilder.control('', [Validators.required])

            // SongUrl: ['', Validators.required],
            // Artist: ['', Validators.required],
            // Album: ['', Validators.required],
            // CoverImage: ['', Validators.required]

        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .subscribe(x => {
                    this.f.SongId.setValue(x.SongId);
                    this.f.SongName.setValue(x.SongName);
                    this.f.SongUrl.setValue(x.SongUrl);
                    this.f.Artist.setValue(x.Artist);
                    this.f.Album.setValue(x.Album);
                    this.f.CoverImage.setValue(x.CoverImage);
                });
        }
    }


    get f() { return this.form.controls; }

    onSubmit() {
        console.log(this.form);
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createSong();
        } else {
            this.updateSong();
        }
    }

    private createSong() {
        this.accountService.AddSong(this.f.SongName.value, this.f.SongUrl.value, this.f.Artist.value, this.f.Album.value, this.f.CoverImage.value,)
            .subscribe(
                data => {
                    this.alertService.success('Song added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateSong() {
        var cid: number = +this.id;
        this.accountService.update(cid, this.f.SongName.value, this.f.SongUrl.value, this.f.Artist.value, this.f.Album.value, this.f.CoverImage.value)
            .subscribe(
                res => {
                    this.alertService.success('Song Updated successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }


    // private createSong() {
    //     var SongId = ((document.getElementById("SongId") as HTMLInputElement).value);
    //     var SongName = ((document.getElementById("SongName") as HTMLInputElement).value);
    //     var SongUrl = ((document.getElementById("SongUrl") as HTMLInputElement).value);
    //     var Artist = ((document.getElementById("Artist") as HTMLInputElement).value);
    //     var Album = ((document.getElementById("Album") as HTMLInputElement).value);
    //     var CoverImage = ((document.getElementById("CoverImage") as HTMLInputElement).value);


    //     if (this.data.length == 0)
    //         this.id = 1;
    //     if (this.data.length != 0)
    //         this.id = parseInt(this.data[this.data.length - 1]["id"]) + 1;
    //     var obj = { SongId: SongId, SongName: SongName, SongUrl: SongUrl, Artist: Artist, Album: Album, CoverImage: CoverImage, id: this.id };

    //     if (this.id > 1) {
    //         for (var checker = 0; checker < this.data.length; checker++) {
    //             if (this.data[checker]["SongId"] == obj["SongId"] && this.data[checker]["SongName"] == obj["SongName"] && this.data[checker]["SongUrl"] == obj["SongUrl"] && this.data[checker]["Artist"] == obj["Artist"] && this.data[checker]["Album"] == obj["Album"] && this.data[checker]["CoverImage"] == obj["CoverImage"]) {
    //                 document.getElementById("message").innerHTML = "Data Already Exists..!";
    //                 setTimeout(function () { document.getElementById("message").innerHTML = ""; }, 3000);
    //                 return;
    //             }
    //         }
    //     }
    //     var success = this.data.push(obj);
    //     console.log(this.data);

    //     localStorage.setItem('users', JSON.stringify(this.data));


    //     if (success)
    //         this.router.navigate['.'];
    // }
}
