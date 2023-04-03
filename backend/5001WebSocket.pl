
#!/usr/bin/perl
use Net::WebSocket::Server;
use Switch;
use JSON::Parse ':all';
use Unicode::UTF8 'decode_utf8';
use JSON::Tiny '0.58', qw(decode_json encode_json);
use Net::MySQL;

use Web3;
use XMModule;
use DBConnection;
# 9101 미완료
# 9102 완료


# Init DB 
my $mysql = DBConnection::InitMysql();

Net::WebSocket::Server->new(
    listen => 5001,
    on_connect => sub {
        my ($serv, $conn) = @_;
        print "listen => 5001\n";
        $conn->on(
            ready => sub {
            my ($conn) = @_;
            print "ready\n";
            },
            utf8 => sub {
                print "========================5001 WebSocket start========================\n";
                my ($conn, $msg) = @_;
                &swithCase($conn, $msg);
                print "========================5001 WebSocket end========================\n";
            },
            disconnect => sub {
            my ($conn, $code, $reason) = @_;
            print "========================disconnect========================\n";
            $serv->start();
            },
        );          
    },
    
)->start;


# case "xm1020"{

#     return;               
# }
# { "data" : {} , "code"  }
sub swithCase {
    if(defined $mysql){
    ($conn,$clientReq) =@_;
        @splitReq = split("/",$clientReq);
        print "==================$splitReq[0]===================\n";
        my $JSONdata = parse_json ($splitReq[1]);
        switch($splitReq[0]){
        case "xm1010"{
            # 로그인
            my $query = "SELECT member,email FROM Members where pin = password('$JSONdata->{pin}') and id = '$JSONdata->{id}' limit 1;";
            $mysql->query($query);
            my $memberRecord_set = $mysql->create_record_iterator;
            if($memberRecord_set != 0 ){
                my $memberRecord = $memberRecord_set->each;
                $query = "SELECT address FROM Wallets where  CONVERT(AES_DECRYPT(unhex(pin), 'xrun') using utf8) = '$JSONdata->{pin}' and currency = 11 and member = $memberRecord->[0];";
                $mysql->query($query);
                my $walletRecord_set = $mysql->create_record_iterator;
                my $walletRecord = $walletRecord_set->each;
                my $result = {
                    "data" =>{
                        "member" => $memberRecord->[0],
                        "email" => $memberRecord->[1],
                        "address" => $walletRecord->[0] #실데이터에서는 변경 필요
                    },
                    "code" => 9102,
                    "message" => "Login Success"
                };
                $conn->send_utf8(encode_json($result));
            }else{
                my $result = {
                    "code" => 9101,
                    "message" => "Try Error Login..."
                };
                $conn->send_utf8(encode_json($result));
            }
            return;
        }
        case "xm1021_request"{
             my $loginCode = &xm2220_email($JSONdata->{email}); 
                print $loginCode,"\n";
                my $query = "insert into `Transaction` (`action`, `member`, `extrastr`, `extrastr2`) values (9710 , '$JSONdata->{member}' , '$JSONdata->{email}', '$loginCode');";
                $mysql->query($query);
                my $result = {
                    "code" => 9102,
                    "message" => "Send message..."
                };
                $conn->send_utf8(encode_json($result));
                return;
        }
        case "xm2110"{
            # 로그인
            my $query = "SELECT member,email FROM Members where pin = password('$JSONdata->{pin}') and id = '$JSONdata->{id}' limit 1;";
            $mysql->query($query);
            my $memberRecord_set = $mysql->create_record_iterator;
            if($memberRecord_set != 0){
                my $memberRecord = $memberRecord_set->each;
                $query = "SELECT address FROM Wallets where  CONVERT(AES_DECRYPT(unhex(pin), 'xrun') using utf8) = '$JSONdata->{pin}' and currency = 11 and member = $memberRecord->[0];";
                $mysql->query($query);
                my $walletRecord_set = $mysql->create_record_iterator;
                if($walletRecord_set != 0){
                    my $walletRecord = $walletRecord_set->each;
                    my $result = {
                        "data" =>{
                            "id" => $JSONdata->{id},
                            "member" => $memberRecord->[0],
                            "email" => $memberRecord->[1],
                            "address" => $walletRecord->[0] #실데이터에서는 변경 필요
                        },
                        "code" => 9102,
                        "message" => "Login Success"
                    };
                    $conn->send_utf8(encode_json($result));
                }else{
                    my $result = {
                    "code" => 9101,
                    "message" => "Try Error Login..."
                };
                $conn->send_utf8(encode_json($result));
                }
            }else{
                my $result = {
                    "code" => 9101,
                    "message" => "Try Error Login..."
                };
                $conn->send_utf8(encode_json($result));
            }
            return;
        }
        case "xm2210"{
                my $query = "INSERT INTO `Members` (`id`, `pin`, `email`, `mobile`, `status`) VALUES ('$JSONdata->{id}', password('$JSONdata->{pin}'), '$JSONdata->{email}', '$JSONdata->{phonenumber}', '9201');"; 
                print $query,"\n";
                $mysql->query($query);
                my $member =  $mysql->get_insert_id();
                my $curlResult =  Web3::curlRequest("{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"personal_newAccount\",\"params\":[\"$JSONdata->{pin}\"]}");
                my $curlParseJSON = parse_json ($curlResult);
                $query = "INSERT INTO `Wallets` (`address`, `currency`, `subcurrency`, `amount`, `member`, `admember`, `pin`) VALUES ('$curlParseJSON->{result}', '11', '5100', '0.0000000000000000000000000', '$member', '0', hex(aes_encrypt('$JSONdata->{pin}','xrun')));";                
                $mysql->query($query);
                my $result = {
                    "data" => {
                        "member" => $member,
                        "id" =>$JSONdata->{id},
                        "email" => $JSONdata->{email},
                        "address" => $curlParseJSON->{result} , 
                    },
                    "code" => 9102,
                    "message" => "Success sign up"
                };
                $conn->send_utf8(encode_json($result));
            return;
        }
        case "xm2230"{
            $query = "SELECT address FROM Wallets where currency= '11' and member = '$JSONdata->{member}' and address = '$JSONdata->{address}';";
            print $query ,"\n";
            $mysql->query($query);
            my $record_set = $mysql->create_record_iterator;
            if($record_set != 0){
                my $record = $record_set->each;
                my $address =  $record->[0];
                my @userWallet = XMModule::xm1020_walletKeyFileDownload($address);
                my $result = {
                    "code"=>9102,
                    "message"=>"file downalod",
                    "data"  => {
                        filename => @userWallet[0],
                        filedata => @userWallet[1]
                    }
                };
                $conn->send_utf8(encode_json($result));
            }else{
                my $result = {
                                "code"=>9101,
                                "message"=>"not found member wallet",
                            };
                $conn->send_utf8(encode_json($result));
            }
            return;
        }
        case "xm2221_request" {
                # 이메일 사용자 이메일로 전송 
                my $loginCode = &xm2220_email($JSONdata->{email}); 
                print $loginCode,"\n";
                my $query = "insert into `Transaction` (`action`, `member`, `extrastr`, `extrastr2`) values (9710 , '$JSONdata->{member}' , '$JSONdata->{email}', '$loginCode');";
                $mysql->query($query);
                my $result = {
                    "code" => 9102,
                    "message" => "Send message..."
                };
                $conn->send_utf8(encode_json($result));
            return;
        }
        case ("xm2222_auth"){
                my $query = "select transaction, extrastr, extrastr2, datetime , timestampdiff(second, datetime, now())  from Transaction
                where extrastr = '$JSONdata->{email}' and extrastr2 = '$JSONdata->{code}' and timestampdiff(second, datetime, now())  < 60
                order by transaction desc 
                limit 1";
                $mysql->query($query);
                 if(int($mysql->has_selected_record())){
                    my $query = "UPDATE `Members` SET `status` = '9203' WHERE (`member` = '$JSONdata->{member}');"; 
                    $mysql->query($query);
                    my $result = {
                        "code" => 9102,
                        "message" => "Success email Authoriazation"
                    };
                    $conn->send_utf8(encode_json($result));    
                }else{
                    my $result = {
                        "code" => 9101,
                        "staus" =>"resend email"
                    };
                    $conn->send_utf8(encode_json($result));    
                }
            return;
        }
        case "xm3050"{
            my $query = "SELECT count(*) FROM Members where pin = password('$JSONdata->{pin}') and member = '$JSONdata->{member}' limit 1;";
            $mysql->query($query);

            my $record_set = $mysql->create_record_iterator;
            my $record = $record_set->each;
            if($record->[0] != 0){
                 my $result = {
                        "code" => 9102,
                        "message" => "Success  Authoriazation passsword"
                };
                $conn->send_utf8(encode_json($result));
            }else{
                my $result = {
                    "code" => 9101,
                    "staus" =>"Not Match Password"
                };
                $conn->send_utf8(encode_json($result));
            }
            return;
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
    }else{
        $conn->send_utf8("{\"result\" : \"Database Not Connection\"}");
    }
    
}  








sub xm2220_email {
    # ($email) = @_;
    print "Email Module \n";
    my $randCode = int(rand(10000));
    my $msg = Mail::Mailer->new("smtp",Server => "localhost");
    $msg->open({
        From => 'Hello@asd.com',
        To => 'dbals0@naver.com',
        Subject => "XMask 인증 번호"
        }) or die "Cant";

    my $body="XMask 인증 번호 : ".$randCode;
    print $msg $body;
    $msg->close();
    return $randCode;
}