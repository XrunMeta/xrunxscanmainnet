use strict;

use warnings;

 

use Email::Sender::Simple qw(sendmail);

use Email::Sender::Transport::SMTP ();

use Email::Simple ();

use Email::Simple::Creator ();

 

my $smtpserver = 'email-smtp.ap-southeast-1.amazonaws.com';

my $smtpport = 25;
my $smtpuser   = 'AKIAUOVRMYK2JE57K5NF';

my $smtppassword = 'BJ5FxuDPmeMRMIZPKUQx6SW1Zk1ZlQQT+SXdL+UjBfRv';

 

my $transport = Email::Sender::Transport::SMTP->new({

  host => $smtpserver,

  port => $smtpport,

  sasl_username => $smtpuser,

  sasl_password => $smtppassword,

});

 

my $email = Email::Simple->create(
  header => [
    From    => 'xrun@xrun.run',
    To      => 'dbals0@naver.com',
    Subject => 'Hi!',
  ],
  body => "This is my message\n",
);
 

sendmail($email, { transport => $transport });