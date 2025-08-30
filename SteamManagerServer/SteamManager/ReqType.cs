using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SteamManagerServer.SteamManager
{
    public class ReqType
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string ContentPath { get; set; } = string.Empty;
        public string PreviewPath { get; set; } = string.Empty;
        public string? ChangeNote { get; set; }
        public ulong? ItemId { get; set; }
    }
}
