import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = null;

    constructor(private accountService: AccountService) { }

    ngOnInit() {
        this.accountService.getSongs()
            .subscribe(users => {
                this.users = users;
                console.log(this.users);
            });
    }

    deleteUser(id: number) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .subscribe((res) => {
                this.users = this.users.filter(x => x.id !== id)
                console.log(res);

            });
    }

    // delete(row: number) {
    //     //console.log(this.userDetails[i]);

    //     for (var index = 0; index < this.users.length; index) {
    //         if (row === index)
    //             this.users.splice(index, 1);
    //     }
    // }
}