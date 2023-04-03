package DBConnection; 
use Net::MySQL;
# use Net::Address::IP::Local;
# /usr/lib/x86_64-linux-gnu/perl/5.30
sub InitMysql {
    print ("Init Perl DB");
    my $mysql = Net::MySQL->new( 
        hostname => 'xrundbinstance.ctauiqqlg2bt.ap-southeast-1.rds.amazonaws.com',
        database => 'xrun',
        port 	 => '3306',
        user     => 'xrundb',
        password => 'xrundatA6a52!!'
    );
    return $mysql;
}

sub closeMysql {
    ($mysql) = @_;
    $mysql->close;
    print ("Close Perl DB");
}

1;