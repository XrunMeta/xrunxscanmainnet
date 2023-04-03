#!/usr/bin/perl
# ssl_certificate ;
# ssl_certificate_key /etc/letsencrypt/live/xscan.xrun.run/privkey.pem;
use DBI;
use Net::WebSocket::Server;
use IO::Socket::SSL;
use Switch;
use Web3; 


my $ssl_server = IO::Socket::SSL->new(
  Listen             => 5,
  LocalPort          => 5009,
  Proto              => 'tcp',
  SSL_startHandshake => 0,
  SSL_cert_file      => '/etc/letsencrypt/live/xscan.xrun.run/fullchain.pem',
  SSL_key_file       => '/etc/letsencrypt/live/xscan.xrun.run/privkey.pem',
) or die "failed to listen: $!";
 
Net::WebSocket::Server->new(
    listen => $ssl_server,
    on_connect => sub {
        my ($serv, $conn) = @_;
        print "listen => 5009\n";
        $conn->on(
            ready => sub {
            my ($conn) = @_;
            print "ready\n";
            },
            utf8 => sub {
                print "Mainloop\n";
                my ($conn, $msg) = @_;
                &swithCase($conn, $msg);
                print "Mainloop End\n";
            },
           
        );          
    },
)->start;




sub swithCase {
    ($conn,$clientReq) =@_;
    print $clientReq."\n";
    @splitReq = split(",",$clientReq);
    if(@splitReq[0] =~ /\// ){
        @splitReq = split("/",$clientReq);
    }
    print @splitReq[0]."\n";
    switch(@splitReq[0]){
        case "blockList" {
            $result = Web3::getBlockList(@splitReq[1]);
            $result=~s/\x1b\[[0-9;]*m//g;   
            $conn->send_utf8($result);
            return;
        }
        case "getBlockByTransactionHashList" {
            $result = Web3::getTransactionList();
            $result=~s/\x1b\[[0-9;]*m//g;   
            $conn->send_utf8($result);
            return;
        }
        case "latestBlock" {
            $result = Web3::getLatestBlock();
            $result=~s/\x1b\[[0-9;]*m//g;   
            $conn->send_utf8($result);
            return;
        }
        case "getAccounts"{
            $result = Web3::getAccounts();
            $result=~s/\x1b\[[0-9;]*m//g;   
            $conn->send_utf8($result);
            return;
        }
        case "detail_block"{
            $result = Web3::getBlock();
            $result=~s/\x1b\[[0-9;]*m//g;   
            $conn->send_utf8($result);
            return;
        }
        case "detail_transaction"{
            print "detail_transaction ===========";
            $result = Web3::getTransactionReceipt(@splitReq[1]);
            $result=~s/\x1b\[[0-9;]*m//g;       
            $conn->send_utf8($result);
            return;
        }
        case "detail_transaction_recepit"{
            $result = Web3::getTransactionReceipt(@splitReq[1]);
            $result=~s/\x1b\[[0-9;]*m//g;   
            $conn->send_utf8($result);
            return;
        }
        case "account_transaction_list"{
            $result = Web3::getAccountByTrnanscationList(@splitReq[1]);
            $result=~s/\x1b\[[0-9;]*m//g;   
            if(!$result){
                $result = "[]";
            }
            $conn->send_utf8($result);
            return;
        }
        case "curl_JSON_RPC"{
            print "curl_JSON_RPC====================\n";
            $result = Web3::curlRequest(@splitReq[1]);
            $conn->send_utf8($result);
            return ;
        }
        case "defult" {
            $conn->send_utf8("defult");
            return;
        }
        else {
            $conn->send_utf8("{\"result\" : \"connection\"}");
            return;
        }
    }
}  
