package XMModule;
use Mail::Mailer;
use Expect;

sub xm2210_email {
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
}

sub findKeystorePath {
    ($userAddress) = @_;
    my $subAddress = substr $userAddress , 2;
    my $command = Expect->spawn("find /home/ubuntu/geth/data/keystore/ -name \"*$subAddress\""); 
    my $timeout = 10;
    unless( $command->expect($timeout, -re => ' ' )){
        print "====result====\n"
    }
    if($command->log_stdout){
        return $command->before();
    }
}

sub xm1020_walletKeyFileDownload {
    ($address) = @_;
    my @arr =();
    my $WalletFileContent = &findKeystorePath($address);
    push(@arr,$WalletFileContent);
    open( fileHandle,$WalletFileContent ) || die "Cannot open user keystore\n";
    my $count = 0;
    my $line;
    while(<fileHandle>) {
        push(@arr,$_);
    }
    close(fileHandle); 
    return @arr;
}

1;
