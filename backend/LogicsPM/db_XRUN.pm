package DBConnection; 
use Net::MySQL;
# use Net::Address::IP::Local;

sub InitMysql {
    print ("Init Perl DB");
    my $mysql = Net::MySQL->new( 
        hostname => 'database-jakarta-instance-1.cxm4wpmtypu5.ap-southeast-3.rds.amazonaws.com',
        database => 'xrun',
        port 	 => '3306',
        user     => 'admin',
        password => 'YDAHVBPNSLZT'
    );
    return $mysql;
}

sub closeMysql {
    ($mysql) = @_;
    $mysql->close;
    print ("Close Perl DB");
}

1;