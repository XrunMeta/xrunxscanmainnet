 #!/usr/bin/perl
use Mail::Mailer;
use strict; 
use warnings;

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
