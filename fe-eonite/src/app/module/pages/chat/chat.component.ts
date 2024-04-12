import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiServiceService } from '../../services/rest-api-service.service';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { environment } from 'src/app/enviroment/environment';
import { HttpEventType } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages:Message[]=[];
  chatRoom:Room[]=[];
  public stompClient: any;
  newmessage: string | undefined;
  userType?: string;
  activeMessage:boolean= false;
  chatRoomId?:Room;
  loader:boolean=false;
  constructor(private restService:RestApiServiceService, private route: ActivatedRoute,private router: Router,private ngZone: NgZone,private datePipe:DatePipe){
    if(this.route.snapshot.queryParamMap.get('vendorId')! && this.route.snapshot.queryParamMap.get('userId')!) this.findSelectedMessages(this.route.snapshot.queryParamMap.get('vendorId')!,this.route.snapshot.queryParamMap.get('userId')!);
  }

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('AUTH')!;
    this.initializeWebSocketConnection();
    this.getChatRoom();
    // setInterval(() => {
    //   this.ngZone.run(() => {

    //   });
    // }, 100);
  }

  getChatRoom(){
    this.loader=true;
    if(this.userType =='USER') this.restService.findMessageUser(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        this.chatRoom = Object(event.body);
        this.chatRoom.forEach((e)=>{
          this.restService.getNotif(e.chatId).subscribe((event)=>{
            if(event.type == HttpEventType.Response && event.body && event.ok){
              let data = Object(event.body);
              e.lastText = data.message;
              e.notification = data.total;
              e.recType = data.recType;
            }
          })
        })
        this.loader=false;
      }
    });
    else if(this.userType =='VENDOR') this.restService.findMessageVendor(Number(sessionStorage.getItem('ID'))).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        this.chatRoom = Object(event.body);
        this.chatRoom.forEach((e)=>{
          this.restService.getNotif(e.chatId).subscribe((event)=>{
            if(event.type == HttpEventType.Response && event.body && event.ok){
              let data = Object(event.body);
              e.lastText = data.message;
              e.notification = data.total;
              e.recType = data.recType;
            }
          })
        })
        this.loader=false;
      }
    });

  }

  initializeWebSocketConnection() {
    const serverUrl = `${environment.chatUrl}/chat-websocket`;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, () => {
      that.stompClient.subscribe('/chat/messages', (message: { body: string; }) => {
        if (message.body) {
          let obj = JSON.parse(message.body);
          console.log(obj)
          if(String(obj.chatId) == this.chatRoomId?.chatId) that.addMessage(obj);
          this.getChatRoom();
        }
      });
    });
  }

  addMessage(obj: Message) {
    this.messages.push(obj);
  }

  sendMessage() {
    let sendId:any, recId:any, sendType:any, recType:any;
    if(this.userType == 'USER'){
      sendId = this.chatRoomId?.userId;
      recId = this.chatRoomId?.vendorId;
      sendType = 'USER';
      recType = 'VENDOR';
    }else if(this.userType == 'VENDOR'){
      sendId = this.chatRoomId?.vendorId;
      recId = this.chatRoomId?.userId;
      sendType = 'VENDOR';
      recType = 'USER';
    }
    let obj: Message = {
      chatId:this.chatRoomId?.chatId!,
      senderId:sendId!,
      recipientId:recId!,
      senderType:sendType!,
      recipientType:recType!,
      content:this.newmessage!,
      timestamp:new Date()
    };
    this.newmessage = '';
    this.stompClient.send('/app/sendmsg', {}, JSON.stringify(obj));
  }

  deleteRoom(){
    this.restService.deleteChatRoom(this.chatRoomId?.vendorId!, this.chatRoomId?.userId!).subscribe();
    const currentUrl = this.router.url;
    const urlTree = this.router.parseUrl(currentUrl);
    const urlWithoutParams = urlTree.root.children['primary'].segments.map(segment => segment.path).join('/');
    this.router.navigate([urlWithoutParams]);
    this.chatRoomId = undefined;
    this.getChatRoom();
    this.activeMessage = false;
  }

  findSelectedMessages(vendorId:string, userId:string){
    this.newmessage = '';
    this.messages=[];
    this.restService.findChatMessages(Number(vendorId),Number(userId),sessionStorage.getItem('AUTH')!).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        this.messages = Object(event.body);
        this.restService.getChatRoom(Number(vendorId),Number(userId)).subscribe((event)=>{
          if(event.type == HttpEventType.Response && event.body && event.ok){
            let data = Object(event.body);
            this.chatRoomId = data[0];
            this.activeMessage = true;
          }
        })
        this.getChatRoom();
      }
    })
  }

  findMessages(i:Room){
    this.newmessage = '';
    this.messages=[];
    this.restService.findChatMessages(i.vendorId,i.userId,sessionStorage.getItem('AUTH')!).subscribe((event)=>{
      if(event.type == HttpEventType.Response && event.body && event.ok){
        this.messages = Object(event.body);
        this.getChatRoom();
      }
    })
    this.chatRoomId = i;
    this.activeMessage = true;
  }

  isActive(chatId:string){
    return this.chatRoomId?.chatId == chatId? true:false;
  }

  changeDate(date:string){
    return this.datePipe.transform(date, 'dd MMMM YYYY HH:mm') || '';
  }
}

export interface Message {
  id?:number;
  chatId:string;
  senderId:number;
  recipientId:number;
  senderType:string;
  recipientType:string;
  content:string;
  timestamp:any;
  status?:any;
}

export interface Room {
  id:number;
  chatId:string;
  vendorId:number;
  userId:number;
  userfirstName:string;
  userlastName:string;
  userPhoto:any;
  vendorName:string;
  vendorPhoto:any;
  lastText:string;
  notification:number;
  recType:string;
}

export interface notification{
  chatId:string;
  message:string;
  total:number;
  recType:string;
}
