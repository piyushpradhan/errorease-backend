CREATE MIGRATION m12wqrfrf2jxtwgnqhgkehhnfmwtilxilpdwuamzdb7lodprs6yooq
    ONTO m1ztqlr62bpdq7atod24yli2cmlooxwp4ffiy64zm2yd6ojgdwi3mq
{
  ALTER TYPE default::Label {
      ALTER LINK issue {
          RESET OPTIONALITY;
      };
  };
};
