module default {
  type User {
    required uid: str {
      constraint exclusive;
    }
    required displayName: str;
    required username: str {
      constraint exclusive;
    }
    required email: str {
      constraint exclusive;
      constraint regexp(r'[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}');
    }
    multi labels := .<owner[is Label];
    multi issues := .<owner[is Issue];
  }

  type Link {
    required url: str;
    note: str;
    required issue: Issue {
      on target delete allow;
    };
  }

  type Label {
    required name: str {
      constraint exclusive;
    }
    required owner: User;
    multi issue: Issue {
      on target delete allow;
    };
  }

  type Issue {
    required seqNo: int64 {
      default := (SELECT count(Issue) + 1);
    };
    required title: str;
    description: str;
    required owner: User;
    multi links := .<issue[is Link]; 
    required created_at: datetime;
    required updated_at: datetime;
    multi labels := .<issue[is Label];
    status: str {
      constraint one_of ('Open', 'Closed')
    }
    is_active: bool;
    issue_map: str;
  }
}
